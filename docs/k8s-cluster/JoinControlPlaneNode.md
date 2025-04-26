---
sidebar_position: 3
---

# Join the  control-plane node

#### Retrieve the join token
1. SSH into the control-plane node 
2. Get the joining token and copy for joining

```bash
sudo kubeadm token create --print-join-command
```

#### Install the required components in the new node
1. SSH into new node
2. Prepare the node with [Pre-requisites](https://ops.kwixeedevops.in/docs/k8s-cluster/Pre-requisites)
3. Join the existing cluster with the command generated from the last control-plane

```bash
sudo kubeadm join <control-plane-ip>:6443 --token <token> --discovery-token-ca-cert-hash sha256:<hash> --control-plane
```

#### Verify the nodes
1. SSH into the control-plane node 
2. Execute `sudo kubectl get nodes`