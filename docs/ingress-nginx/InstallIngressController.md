---
sidebar_position: 1
---
# Install Ingress controller

## Compatible helm version

#### Kubernetes Version:
```bash
kubectl version

# OP:
    Client Version: v1.30.3
    Kustomize Version: v5.0.4-0.20230601165947-6ce0bf390ce3
    Server Version: v1.30.3+k3s1
```

#### ingress-nginx version: 

Check the version compatibility from the matrix in this repo : https://github.com/kubernetes/ingress-nginx
    
We can use any of this range to deploy ingress-nginx, according to my k8s version above I choose to deploy the following versions, always go with latest version

```bash
ingress-nginx : v1.10.1 - v1.11.2 
NGINX verison : 1.25.3 - 1.25.5
helm chart version : 	4.10.0 - 4.11.2
```

## Get the compatible helm version for the kubernetes environment:

Search for the ingress nginx helm version check the one which satisfies with the above values 

```bash
helm search repo ingress-nginx --versions
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
```

## Option 1: Install helm chart with the version: 
```bash
helm install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx --create-namespace \
  --version 4.11.2 \
  --set controller.image.tag=v1.11.2 \
  --set controller.nginx.image.tag=1.25.5
```


```bash

NAME: ingress-nginx
LAST DEPLOYED: Tue Sep 24 03:34:59 2024
NAMESPACE: ingress-nginx
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
The ingress-nginx controller has been installed.
It may take a few minutes for the load balancer IP to be available.
You can watch the status by running 'kubectl get service --namespace ingress-nginx ingress-nginx-controller --output wide --watch'

An example Ingress that makes use of the controller:
  apiVersion: networking.k8s.io/v1
  kind: Ingress
  metadata:
    name: example
    namespace: foo
  spec:
    ingressClassName: nginx
    rules:
      - host: www.example.com
        http:
          paths:
            - pathType: Prefix
              backend:
                service:
                  name: exampleService
                  port:
                    number: 80
              path: /
    # This section is only required if TLS is to be enabled for the Ingress
    tls:
      - hosts:
        - www.example.com
        secretName: example-tls

If TLS is enabled for the Ingress, a Secret containing the certificate and key must also be provided:

  apiVersion: v1
  kind: Secret
  metadata:
    name: example-tls
    namespace: foo
  data:
    tls.crt: <base64 encoded cert>
    tls.key: <base64 encoded key>
  type: kubernetes.io/tls
```

## Option 2(Recommended for production):  Create the template from the helm chart 
```bash
helm template ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx --create-namespace \
  --version 4.11.2 \
  > ./ingress-nginx-1.25.5.yml

kubectl create namespace ingress-nginx 
kubectl apply -f ingress-nginx-1.25.5.yml -n ingress-nginx
```