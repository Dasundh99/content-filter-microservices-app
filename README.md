# Content Filter Cloud Project

A **microservices-based content filter application** deployed using Docker and Kubernetes (Minikube). This project demonstrates a cloud-native approach to managing content filtering, including services for authentication, posts, comments, moderation, queries, and event handling.

---

## Table of Contents

- [Project Overview](#project-overview)  
- [Prerequisites](#prerequisites)  
- [Docker Setup](#docker-setup)  
- [Kubernetes Setup](#kubernetes-setup)  
- [Running the Application](#running-the-application)  
- [Stopping the Application](#stopping-the-application)  
- [Useful Commands](#useful-commands)

---

## Project Overview

This project includes the following microservices:

- **Frontend**: React client application  
- **Auth Service**: Handles user authentication  
- **Posts Service**: Manages posts  
- **Comments Service**: Handles comments on posts  
- **Moderation Service**: Content moderation  
- **Query Service**: Query aggregator service  
- **Event Bus**: Event-driven communication between microservices  

All services can be run locally using Docker Compose or deployed on Kubernetes using Minikube.

---

## Prerequisites

- Docker  
- Docker Compose  
- Minikube  
- kubectl  

---

## Docker Setup

1. **Build and run services with Docker Compose**

```bash
docker compose up --build
````

2. **Build individual Docker images (if needed)**

```bash
docker build -t content-filter-microservices-app-frontend:latest ./client
docker build -t content-filter-microservices-app-auth-service:latest ./auth
docker build -t content-filter-microservices-app-posts-service:latest ./posts
docker build -t content-filter-microservices-app-comments-service:latest ./comments
docker build -t content-filter-microservices-app-moderation-service:latest ./moderation
docker build -t content-filter-microservices-app-query-service:latest ./query
docker build -t content-filter-microservices-app-event-bus:latest ./event-bus
```

---

## Kubernetes Setup (Minikube)

1. **Start Minikube with Docker driver**

```bash
minikube start --driver=docker
```

2. **Check Minikube status**

```bash
minikube status
```

3. **Use Minikube Docker environment**

```bash
eval $(minikube docker-env)
```

4. **Deploy the application to Kubernetes**

```bash
kubectl apply -f k8s/
```

5. **Delete the deployment if needed**

```bash
kubectl delete -f k8s/
```

6. **Check all Kubernetes resources**

```bash
kubectl get all
kubectl get pods -w
```

7. **Access the frontend service**

```bash
minikube service frontend
```

---

## Useful Commands

* Rebuild Docker Compose containers: `docker compose up --build`
* Monitor pods: `kubectl get pods -w`
* Delete Kubernetes deployment: `kubectl delete -f k8s/`
* Access frontend in browser: `minikube service frontend`

