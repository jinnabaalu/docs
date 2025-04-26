---
sidebar_position: 1
---

# Pre-requisites
- Enable iptables Bridged Traffic 
- Disable Swap (Important for Kubernetes)
- Install CRI-O Runtime
- Install kubeadm, kubelet, and kubectl
- Set KUBELET_EXTRA_ARGS
- Install Calico Network

#### Enable iptables Bridged Traffic 

```bash
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
br_netfilter
overlay
EOF

sudo modprobe br_netfilter
sudo modprobe overlay

cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1
EOF

sudo sysctl --system
```

#### Disable swap
```bash
sudo swapoff -a
(crontab -l 2>/dev/null; echo "@reboot /sbin/swapoff -a") | crontab - || true
```

#### Install CRI-O Runtime
CRI - Container Runtime Interface using Open container initiative
https://cri-o.io/

```bash
sudo apt-get update -y
sudo apt-get install -y software-properties-common curl apt-transport-https ca-certificates

curl -fsSL https://pkgs.k8s.io/addons:/cri-o:/prerelease:/main/deb/Release.key |
    gpg --dearmor -o /etc/apt/keyrings/cri-o-apt-keyring.gpg
echo "deb [signed-by=/etc/apt/keyrings/cri-o-apt-keyring.gpg] https://pkgs.k8s.io/addons:/cri-o:/prerelease:/main/deb/ /" |
    tee /etc/apt/sources.list.d/cri-o.list

sudo apt-get update -y
sudo apt-get install -y cri-o

sudo systemctl daemon-reload
sudo systemctl enable crio --now
sudo systemctl start crio.service
```
Why we are not using docker : https://kubernetes.io/blog/2022/02/17/dockershim-faq/


Install `crictl` and `critest` , https://github.com/kubernetes-sigs/cri-tools

```bash
VERSION="v1.31.1"
wget https://github.com/kubernetes-sigs/cri-tools/releases/download/$VERSION/crictl-$VERSION-linux-amd64.tar.gz
sudo tar zxvf crictl-$VERSION-linux-amd64.tar.gz -C /usr/local/bin
rm -f crictl-$VERSION-linux-amd64.tar.gz



VERSION="v1.31.1"
wget https://github.com/kubernetes-sigs/cri-tools/releases/download/$VERSION/critest-$VERSION-linux-amd64.tar.gz
sudo tar zxvf critest-$VERSION-linux-amd64.tar.gz -C /usr/local/bin
rm -f critest-$VERSION-linux-amd64.tar.gz
```



#### Install kubeadm, kubelet, and kubectl

```bash

sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.31/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
echo "deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.31/deb/ /" | sudo tee /etc/apt/sources.list.d/kubernetes.list

sudo apt update
# Fin the latest version 
apt-cache madison kubeadm | tac

sudo apt-get install -y kubelet=1.31.1-1.1 kubectl=1.31.1-1.1 kubeadm=1.31.1-1.1

sudo apt-mark hold kubelet kubeadm kubectl
```

Above steps are needed for every node in the cluster

#### Set KUBELET_EXTRA_ARGS

```bash
sudo apt-get install -y jq
local_ip="$(ip --json addr show eth0 | jq -r '.[0].addr_info[] | select(.family == "inet") | .local')"
cat > /etc/default/kubelet << EOF
KUBELET_EXTRA_ARGS=--node-ip=$local_ip
EOF

cat /etc/default/kubelet
```

####  Install Callico Network Plugin
```bash
kubectl apply -f https://docs.projectcalico.org/manifests/calico.yaml

kubectl get po -n kube-system
```


#### Setup Kubernetes Metrics Server

```bash
$ kubectl top nodes
$ kubectl apply -f https://raw.githubusercontent.com/techiescamp/kubeadm-scripts/main/manifests/metrics-server.yaml
$ kubectl top nodes
NAME                   CPU(cores)   CPU%   MEMORY(bytes)   MEMORY%
argocd-grafana         58m          0%     1587Mi          10%
harbour-vm             57m          1%     1572Mi          20%
devops            288m         1%     1842Mi          2%
qxydevrunnervm1        189m         1%     6054Mi          9%
self-hosted-runner-3   53m          1%     1061Mi          6%
selfhosted-runner-2    81m          2%     1649Mi          10%

$ kubectl top pod -n kube-system 
NAME                                       CPU(cores)   MEMORY(bytes)
calico-kube-controllers-6879d4fcdc-s8v94   3m           15Mi
calico-node-4v2v8                          22m          77Mi
calico-node-665qh                          49m          86Mi
calico-node-pcl75                          62m          85Mi
calico-node-rv9rd                          32m          82Mi
calico-node-vl4k9                          20m          77Mi
calico-node-vlpz2                          25m          77Mi
coredns-7c65d6cfc9-qf5x9                   4m           14Mi
coredns-7c65d6cfc9-qr67f                   4m           14Mi
etcd-devops                           56m          68Mi
kube-apiserver-devops                 105m         319Mi
kube-controller-manager-devops        33m          56Mi
kube-proxy-4bh75                           2m           13Mi
kube-proxy-7nxq5                           1m           13Mi
kube-proxy-cx7j9                           1m           14Mi
kube-proxy-h29dq                           1m           12Mi
kube-proxy-kgmq8                           1m           12Mi
kube-proxy-ldtsm                           1m           12Mi
kube-scheduler-devops                 7m           19Mi
metrics-server-78999cb768-fjs49            8m           21Mi
```

