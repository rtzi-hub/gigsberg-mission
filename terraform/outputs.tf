output "vpc_id" {
  value = aws_vpc.main.id
}

output "public_subnets" {
  value = [aws_subnet.public_a.id, aws_subnet.public_b.id]
}

output "private_subnets" {
  value = [aws_subnet.private_a.id, aws_subnet.private_b.id]
}

output "eks_cluster_name" {
  value = aws_eks_cluster.gigsberg.name
}

output "eks_cluster_endpoint" {
  value = aws_eks_cluster.gigsberg.endpoint
}
