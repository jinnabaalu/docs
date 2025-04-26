---
sidebar_position: 5
---
# Graceful Node Removal
1. Cordon `kubectl cordon <node-name>`
2. Drain `kubectl drain <node-name> --ignore-daemonsets --delete-local-data`
    2.1 Evict all pods running
    2.2 Reschedule the evicted pods onto other available nodes
    2.3 if PodDisruptionBudgets causes failure, check pdb `kubectl get pdb`, resolved before drain.
3. Verify the Node is Drained `kubectl get pods --all-namespaces --field-selector spec.nodeName=<node-name>`
4. Remove `kubectl delete node <node-name>`
5. Check Cluster Health `kubectl get nodes` and `kubectl get pods --all-namespaces`