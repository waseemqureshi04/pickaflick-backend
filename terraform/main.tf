terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }
}

provider "aws" {
  region = "ap-south-1" # Mumbai Region
}

# 1. Fetch the latest Ubuntu 24.04 AMI automatically
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical (Ubuntu Creator)

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# 2. Upload your SSH Public Key to AWS
resource "aws_key_pair" "deployer" {
  key_name   = "pickaflick-key"
  public_key = file("pickaflick_key.pub")
}

# 3. Create a Security Group (Firewall)
resource "aws_security_group" "web_sg" {
  name        = "pickaflick-sg"
  description = "Allow SSH, HTTP, HTTPS, and App Port"

  # SSH (For Ansible)
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTP (For Caddy/Web)
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTPS (For Secure Web)
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Node.js App (Optional debug port)
  ingress {
    from_port   = 3002
    to_port     = 3002
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow all outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# 4. Create the EC2 Instance
resource "aws_instance" "app_server" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t2.micro" # Free tier eligible
  key_name      = aws_key_pair.deployer.key_name
  security_groups = [aws_security_group.web_sg.name]

  tags = {
    Name = "Pickaflick-Backend"
  }
}

# 5. AUTOMATION: Create the Ansible Inventory file automatically
resource "local_file" "ansible_inventory" {
  content = <<EOT
[webserver]
${aws_instance.app_server.public_ip} ansible_user=ubuntu ansible_ssh_private_key_file=./pickaflick_key ansible_ssh_common_args='-o StrictHostKeyChecking=no'
EOT
  filename = "inventory.ini"
}

# 6. Output the IP address to the console
output "instance_ip" {
  value = aws_instance.app_server.public_ip
}