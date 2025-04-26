---
sidebar_position: 2
---

#### Check Cert-Manager pods and GoDaddy Webhook

```bash
kubectl get pods -n cert-manager
```
#### Validate the Godaddy API key 

```bash
kubectl get secret godaddy-api-key -n cert-manager -o yaml
```

#### Validate Cluster Issuer

```bash
kubectl describe clusterissuer letsencrypt-prod
```
Reason:                ACMEAccountRegistered
Status:                True
Type:                  Ready

#### Certificate Request validation

```bash
kubectl describe certificate wildcard-kwixeerdbms-com -n cert-manager
```
Name comes from the certificate.yml `metadata.name`

Message:               Certificate is up to date and has not expired
Reason:                Ready
Status:                True
Type:                  Ready #IF ANY ERRORS HERE REQ DEBUG

Renewal time :
  Not After:               2024-12-10T04:33:45Z
  Not Before:              2024-09-11T04:33:46Z
  Renewal Time:            2024-11-30T04:33:45Z

# List the certificate request 

```bash
kubectl get certificaterequest -n cert-manager
kubectl describe certificaterequest <name> -n cert-manager
# ex: kubectl describe certificaterequest wildcard-kwixeerdbms-com-1 -n cert-manager
```

This prints the certificates approval and certificate status



#### Validate DNS records and certificate issuance

```bash
kubectl logs -n cert-manager deployment/cert-manager
```

If you see the log like below sample: This is expected behaviour 
```bash
I0911 07:42:53.057749 1 sync.go:416] "certificate resource is not owned by this object. refusing to update non-owned certificate resource for object" logger="cert-manager.controller.ingress-shim" resource_name="jeevantestadminapi-kwixeerdbms-com-ingress" resource_namespace="vbv-api" resource_kind="" resource_version="" related_resource_name="wildcard-kwixeerdbms-com-tls" related_resource_namespace="vbv-api" related_resource_kind="Certificate" related_resource_version="v1"
```


#### Check the certificate by domain
```bash
kubectl get secret wildcard-kwixeerdbms-com-tls -n vbv-api -o yaml
```

Decode certificate for the domain `kubectl get secret wildcard-kwixeerdbms-com-tls -n vbv-api -o jsonpath='{.data.tls\.crt}' | base64 --decode | openssl x509 -text -noout`, this will give lot of info about cert like what we see in browser. 