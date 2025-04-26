
#### Init Kubeadm Control Plane

```bash
IPADDR="172.162.12.2"
NODENAME=$(hostname -s)
POD_CIDR="192.168.0.0/16"
```

Getting different public IPs for these servers 
curl ifconfig.me && echo ""

```bash
kubeadm init \
    --apiserver-advertise-address=172.162.12.2 \
    --pod-network-cidr 192.168.0.0/16 \
    --node-name devops \
    --apiserver-cert-extra-sans=172.162.12.2 
```

```bash
# OUTPUT:

Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

Alternatively, if you are the root user, you can run:

  export KUBECONFIG=/etc/kubernetes/admin.conf

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/

You can now join any number of control-plane nodes by copying certificate authorities
and service account keys on each node and then running the following as root:

  kubeadm join 172.162.12.2:6443 --token mdv2ag.hfodxsw6c9e7e7vu \
	--discovery-token-ca-cert-hash sha256:c79c320c52224f9ef4f61569d63dfc5c4d0b54161fbc0e0d1c031e5a1f412b82 \
	--control-plane

Then you can join any number of worker nodes by running the following on each as root:

kubeadm join 172.162.12.2:6443 --token mdv2ag.hfodxsw6c9e7e7vu \
	--discovery-token-ca-cert-hash sha256:c79c320c52224f9ef4f61569d63dfc5c4d0b54161fbc0e0d1c031e5a1f412b82

```

