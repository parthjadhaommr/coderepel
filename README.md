# Online Web IDE

This project is an online web-based Integrated Development Environment (IDE) that allows users to create and manage development environments directly in their browser. It provides a seamless, real-time coding experience with a dedicated container for each project.

---

### Features

Our MVP (Minimum Viable Product) focuses on providing a robust core experience, which includes:

* **Project Creation:** Users can create a new project from a predefined template.
* **Real-time Editor:** A live development loop where file changes are synchronized between the browser and the container.
* **Integrated Terminal:** Full terminal access within the browser for running commands, managing processes, and interacting with the environment.
* **Automatic Cleanup:** Runner Pods are automatically deleted when there are no active WebSocket connections, ensuring efficient resource management.

---

### Architecture

The system is built on a distributed, cloud-native architecture designed for scalability and performance.

#### High-Level Overview

The architecture consists of a few key services:

* **Frontend (Browser):** The user interface for creating projects, editing code, and interacting with the terminal.
* **HTTP API:** A backend service that handles user requests, such as creating a new project. It interacts with S3 to manage project templates and artifacts.
* **Orchestrator:** A core service that manages the lifecycle of the runner pods in the Kubernetes cluster. It's responsible for creating a pod when a user wants to start a project and deleting it when the session ends.
* **Runner Pod:** A dedicated container running the code runtime and a WebSocket server. This is where the user's code and files are located, and where all the real-time communication happens.
* **S3 (Object Storage):** Stores base images (templates) for different project types and holds the project-specific code and artifacts.
* **Kubernetes Cluster:** The underlying infrastructure that hosts and manages the Runner Pods.

```mermaid
flowchart TB
    subgraph Client["Frontend (Browser)"]
      HP["Homepage and Project List"]
      CP["Create Project Popup: template + title"]
    end

    subgraph Backend["Backend Services"]
      API["HTTP API Service"]
      ORCH["Orchestrator (HTTP/WS)"]
    end

    subgraph Infra["Infrastructure"]
      S3["S3 Object Storage"]
      subgraph K8S["Kubernetes Cluster"]
        RPod["Runner Pod\nWS Server + Code Runtime"]
      end
    end

    %% Browsing & project creation
    HP --> CP
    CP -- "Create Project (HTTP)" --> API
    API -- "Get base image & copy to project bucket" --> S3
    API -- "projectId, s3Path" --> CP

    %% Pod orchestration
    CP -- "Start Runner (HTTP)" --> ORCH
    ORCH -- "create Pod" --> K8S
    RPod -- "pull code" --> S3
    RPod -- "ready: wsUrl/podId" --> ORCH
    ORCH -- "wsUrl" --> Client

    %% Live dev loop
    Client -- "WebSocket connect" --> RPod
    Client == "File diffs (WS)" ==> RPod
    Client == "Terminal I/O (WS)" ==> RPod
    Client == "Process control (WS)" ==> RPod
    RPod == "File updates / stdout / events (WS)" ==> Client

    %% Auto cleanup
    ORCH -. "watch health/WS count" .- RPod
    ORCH -- "delete Pod if 0 WS" --> K8S
    K8S -- "terminated" --> ORCH