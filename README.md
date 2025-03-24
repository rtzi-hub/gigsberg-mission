# 🚀 Gigsberg Mission – DevOps Showcase

This project demonstrates full-cycle DevOps practices using **Terraform**, **EKS**, **Helm**, **Kubernetes**, **Docker**, **Fluent Bit**, **Elasticsearch**, and **Kibana**. It deploys a containerized Node.js application to AWS EKS with observability and logging infrastructure.

Last Updated: March 24, 2025

---

## Project Structure

```
gigsberg-mission/
├── app/                          # Node.js application
├── fluentbit/                   # Fluent Bit Helm values
├── helm/gigsberg-app/           # Helm chart for the app
├── terraform/                   # EKS, VPC, IAM infra via Terraform
├── kibana_dashboard/            # Saved Kibana dashboards (optional)
├── Dockerfile                   # Containerization for Node.js app
├── setup.sh                     # Optional automation script
└── README.md                    # You're here!
```

---

##  1. Infrastructure Setup with Terraform

```bash
cd terraform
terraform init
terraform plan
terraform apply --auto-approve
```

###  To destroy all resources:

```bash
terraform destroy
```

---

##  2. Build & Push Docker Image

```bash
docker build -t gigsberg-mission:latest .
docker tag gigsberg-mission:latest <your-dockerhub-username>/gigsberg-mission:latest
docker push <your-dockerhub-username>/gigsberg-mission:latest
```

---

##  3. Connect to EKS Cluster & Deploy Application

```bash
aws eks update-kubeconfig --name gigsberg-cluster
kubectl get nodes

kubectl create namespace gigsberg-app
helm install gigsberg-app ./helm/gigsberg-app   --namespace gigsberg-app   -f helm/gigsberg-app/values.yaml
```

---

##  4. OIDC & IAM Setup for EBS CSI Driver

### Enable OIDC Provider:

```bash
eksctl utils associate-iam-oidc-provider   --region us-east-1   --cluster gigsberg-cluster   --approve
```

### Create IAM Service Account:

```bash
eksctl create iamserviceaccount   --name ebs-csi-controller-sa   --namespace kube-system   --cluster gigsberg-cluster   --attach-policy-arn arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy   --approve
```

### Verify Role and Get ARN:

```bash
aws iam get-role --role-name AmazonEKS_EBS_CSI_DriverRole   --query 'Role.Arn' --output text
```

```bash
ARN=$(aws iam get-role --role-name AmazonEKS_EBS_CSI_DriverRole   --query 'Role.Arn' --output text)
```

### Deploy EBS CSI Driver:

```bash
eksctl create addon   --cluster gigsberg-cluster   --name aws-ebs-csi-driver   --version latest   --service-account-role-arn $ARN   --force
```

---

##  5. Deploy Elasticsearch & Kibana (Logging)

### Create logging namespace:

```bash
kubectl create namespace logging
```

### Add Elastic Helm repo:

```bash
helm repo add elastic https://helm.elastic.co
helm repo update
```

### Install Elasticsearch:

```bash
helm install elasticsearch elastic/elasticsearch   --namespace logging   --set replicas=1   --set volumeClaimTemplate.storageClassName=gp2   --set persistence.labels.enabled=true
```

### Retrieve Elasticsearch Credentials:

```bash
# Username
kubectl get secret elasticsearch-master-credentials -n logging   -o jsonpath="{.data.username}" | base64 -d && echo

# Password
kubectl get secret elasticsearch-master-credentials -n logging   -o jsonpath="{.data.password}" | base64 -d && echo
```

---

##  6. Install Kibana

```bash
helm install kibana elastic/kibana   --namespace logging   --set service.type=LoadBalancer   --set elasticsearchHosts="https://elasticsearch-master:9200"
```

---

## 7. Fluent Bit Log Collector

### Add Helm repo:

```bash
helm repo add fluent https://fluent.github.io/helm-charts
helm repo update
```

🚨 **Update `fluentbit-values.yaml` with correct ES password.**

### Install Fluent Bit:

```bash
helm install fluent-bit fluent/fluent-bit   --namespace logging   -f fluentbit/fluentbit-values.yaml
```

### To update values later:

```bash
helm upgrade fluent-bit fluent/fluent-bit   --namespace logging   -f fluentbit/fluentbit-values.yaml
```

---

## 8. Kibana Dashboard Goals

Your dashboard should include:

- ✅ **Services running** – Pie chart of `kubernetes.labels.app.keyword`
- ✅ **Task or pod counts** – `unique_count(kubernetes.pod_name.keyword)`
- ✅ **Application health** – Filter logs with `/health`
- ✅ **Scale-up/down events** – Visual match on `"replicas"`, `"Scaled"`, etc.

---

## 📤 Exporting Kibana Dashboard

To save or share:

1. Go to **Stack Management → Saved Objects**
2. Select your dashboard
3. Click **Export** (ensure **include related objects** is checked)

---

## 📎 Summary

| Task                     | Status |
|--------------------------|--------|
| Terraform Infrastructure | ✅ Done |
| EKS Cluster Provisioning | ✅ Done |
| Node.js App Deployment   | ✅ Done |
| Logging (EFK) Stack      | ✅ Done |
| Kibana Dashboard         | ✅ Done |

---

## Tested On

- Terraform v1.x
- Helm v3.x
- AWS CLI v2
- eksctl v0.150+
- Node.js 18+

---

## 📫 Contact

For any questions or improvements, feel free to reach out via GitHub Issues or pull requests.

---





# GigsBerg Mission – Organized Requirements

## Create a project

Deploy NodeJS or any other application of your choice.

---

## Infrastructure as Code

Use Terraform to provision the infrastructure.

---

## Choose a Compute Environment

Deploy the app on ECS or EKS.

---

## Create a small user interface (dashboard)

Build an interface to visually display the infrastructure status, including:

- Services running
- Task or pod counts
- Application health
- Visual indication of scale-up/down events (העלאה וירידה)

---

## Enable log collection

Collect all application and system logs.

Use Elasticsearch (or AWS OpenSearch) for log storage and search.

Optionally connect Kibana for visualization.



