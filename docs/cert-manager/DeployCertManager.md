---
sidebar_position: 1
---

# Deploy cert-manager with wildcard

### Step1. Install cert-manager with helm chart

```bash
helm repo add jetstack https://charts.jetstack.io --force-update

helm install \
  cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --version v1.15.3 \
  --set crds.enabled=true
```

*.kwixeesystem.in
*.kwixeesit.com
 

**Commands used while creating and deleting the components**

- Get all the services running under this namespace: `kubectl get all -n cert-manager`
- Delete all the components in the namespace: `kubectl delete all --all -n cert-manager`
- Get the release name: `helm list -n cert-manager`
- Delete releases : `helm list -n cert-manager -q | xargs -n1 -r helm uninstall -n cert-manager`

### Step1.1 : Install the GoDaddy Webhook
- Cloned the repo from https://github.com/snowdrop/godaddy-webhook
- executed the following commands
```bash
mkdir cert-manager && cd godaddy-webhook
git clone https://github.com/snowdrop/godaddy-webhook.git
export DOMAIN=<yourdomain.com>
helm install -n cert-manager godaddy-webhook ./deploy/charts/godaddy-webhook --set groupName=$DOMAIN
```

Activity @ devops server
```bash
root@devops:/home/devopsprod# cd /root/
root@devops:~# ls
backup  DB  devops  devops_new  files  snap  ssl
root@devops:~# mkdir cert-manager
root@devops:~# cd cert-manager/
root@devops:~/godaddy-webhook# git clone https://github.com/snowdrop/godaddy-webhook.git
Cloning into 'godaddy-webhook'...
remote: Enumerating objects: 734, done.
remote: Counting objects: 100% (272/272), done.
remote: Compressing objects: 100% (93/93), done.
remote: Total 734 (delta 166), reused 230 (delta 155), pack-reused 462 (from 1)
Receiving objects: 100% (734/734), 238.07 KiB | 1.01 MiB/s, done.
Resolving deltas: 100% (375/375), done.
root@devops:~/cert-manager# cd godaddy-webhook/
root@devops:~/cert-manager/godaddy-webhook# ls
common  deploy  Dockerfile  go.mod  go.sum  LICENSE  logging  main.go  main_test.go  Makefile  README.md  scripts  testdata
root@devops:~/cert-manager/godaddy-webhook# export DOMAIN=<yourdomain.com>
helm install -n cert-manager godaddy-webhook ./deploy/charts/godaddy-webhook --set groupName=$DOMAIN
NAME: godaddy-webhook
LAST DEPLOYED: Wed Sep  4 09:54:17 2024
NAMESPACE: cert-manager
STATUS: deployed
REVISION: 1
TEST SUITE: None
```

Take the backup of the deployed webhook for future reference, deployed godaddy-webhook-conf
```bash
helm template godaddy-webhook ./deploy/charts/godaddy-webhook --set groupName=$DOMAIN > deployed-godaddy-webhook-config.yaml
```

### Step2. Create a GoDaddy API keys

Create the godaddy API keys from the godaddy console, [https://developer.godaddy.com/keys](https://developer.godaddy.com/keys)

## Step2.1. Create a secret with the API key

Created with the following secret name

```bash
cat <<EOF > secret-<domain>.yml
apiVersion: v1
kind: Secret
metadata:
  name: <domain>-godaddy-api-key
type: Opaque
stringData:
  token: <GODADDY_API_KEY:GODADDY_SECRET_KEY>
EOF

kubectl apply -f secret.yml -n cert-manager
```

## Step3. Create a clusterissuer certificates using the GoDaddy DNS-01 challenge

> Use the staging acme challenge api for experiment, as the let's encrypt as the threshold for requests. 

```yml
cat <<EOF > clusterissuer.yml 
kind: ClusterIssuer
metadata:
  name: kwixeesystem-letsencrypt-prod
spec:
  acme:
    # https://acme-staging-v02.api.letsencrypt.org/directory
    server: https://acme-v02.api.letsencrypt.org/directory
    email: devopsnotifications@.com
    privateKeySecretRef:
      name: kwixeesystem-letsencrypt-production
    solvers:
    - selector:
        dnsZones:
        - 'kwixeesystem.in'
      dns01:
        webhook:
          config:
            apiKeySecretRef:
              name: kwixeesystem-godaddy-api-key
              key: token
            production: true
            ttl: 600
          groupName: kwixeesystem.in
          solverName: godaddy
EOF
```
Apply  `kubectl apply -f certificate.yml`


## Step4. Create a wildcard certificate

```yml
cat <<EOF > certificate.yml
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: wildcard-kwixeesystem-com
spec:
  secretName: wildcard-kwixeesystem-com-tls
  renewBefore: 240h
  dnsNames:
  - '*.kwixeesystem.in'
  issuerRef:
    name: kwixeesystem-letsencrypt-prod
    kind: ClusterIssuer
EOF
```
- Apply `kubectl apply -f certificate.yml -n cert-manager`

## Step5. Create ingress resources for each subdomain

If you are on the same namespace, where the certificate is created then you can use it without restriction. but when you need it on a different server use the secret repeater to copy the tls certificate from the source namespace to the target namespace.

Here is an example on how to apply the same secret to the application whose namespace is `vbv-api` 

Use the cert replicator to generate new cert keys

```yml
apiVersion: batch/v1
kind: Job
metadata:
  name: cert-replication
  namespace: cert-manager
spec:
  ttlSecondsAfterFinished: 300
  template:
    spec:
      containers:
      - name: cert-replication
        image: bitnami/kubectl:latest
        command:
        - /bin/sh
        - -c
        - |
          SECRET_NAME="wildcard-kwixeerdbms-com-tls"
          SOURCE_NAMESPACE="cert-manager"
          if [ -z "$TARGET_NAMESPACES" ]; then
            echo "No target namespaces provided, exiting."
            exit 1
          fi
          TARGET_NAMESPACES=($TARGET_NAMESPACES)
          kubectl get secret $SECRET_NAME -n $SOURCE_NAMESPACE -o yaml > /tmp/secret.yaml
          for NAMESPACE in "${TARGET_NAMESPACES[@]}"; do
            # Delete the existing secret if it exists
            kubectl delete secret $SECRET_NAME -n $NAMESPACE --ignore-not-found
            # Apply the new secret
            sed "s/namespace: $SOURCE_NAMESPACE/namespace: $NAMESPACE/" /tmp/secret.yaml > /tmp/secret-$NAMESPACE.yaml
            kubectl apply -f /tmp/secret-$NAMESPACE.yaml
          done
        env:
        - name: TARGET_NAMESPACES
          value: "namespace1 namespace2"
      restartPolicy: OnFailure


# update TARGET_NAMESPACES values with space separated values
# kubectl apply -f certificate-replicator.yaml
```

Apply the ingress with the above secret. 

Example : testadminapi.domain.com

```yml
cat <<EOF > testadminapi-ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: testadminapi-kwixeerdbms-com-ingress
  namespace: vbv-api
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - testadminapi.<yourdomain.com>
    secretName: wildcard-kwixeerdbms-com-tls
  rules:
  - host: testadminapi.<yourdomain.com>
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: adminapi
            port:
              number: 5000

EOF
```

Cert-manager will continuously renew the certificates every 80 days, for every other namespace where the cert used need to be updated with the new `tls.crt` and  `tls.key` on renewal. 



