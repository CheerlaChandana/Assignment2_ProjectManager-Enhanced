This enhancement is fully implemented within the Assignment 2 Project Manager, demonstrating advanced algorithmic processing on user-defined data.

Implementation Details
Core Logic: The system implements a Topological Sort Algorithm (using Kahn's algorithm) to resolve task dependencies.

Data Integration: The scheduler reads task dependencies from the DependenciesJson column of the existing ProjectTask database table.

Endpoint: The logic is exposed via a dedicated, versioned endpoint: POST /api/v1/scheduler/projects/{projectId}/schedule.
<img width="1925" height="1095" alt="Screenshot 2025-10-25 092334" src="https://github.com/user-attachments/assets/d580623e-75e8-4579-9143-2cd85955eec4" />
<img width="2089" height="1152" alt="Screenshot 2025-10-25 092324" src="https://github.com/user-attachments/assets/61146495-b808-4476-af0e-aa94a5df7ef2" />
<img width="1930" height="1065" alt="Screenshot 2025-10-25 092352" src="https://github.com/user-attachments/assets/638520ed-3d6f-405c-8f01-338d492a9fde" />
<img width="1947" height="1113" alt="Screenshot 2025-10-25 092437" src="https://github.com/user-attachments/assets/cb7b2e9b-532c-4bb3-a007-ec0fa35bbd1d" />
<img width="1359" height="1049" alt="Screenshot 2025-10-25 092515" src="https://github.com/user-attachments/assets/65f7d17f-eb60-423c-abad-626f33a75de0" />
<img width="1360" height="1269" alt="Screenshot 2025-10-25 094543" src="https://github.com/user-attachments/assets/11ba7227-c80b-4697-bc08-a8d7c63af579" />
How to Use the Scheduler
Access Project Details: Log in and navigate to any Project Details Page.

Create Tasks with Dependencies: Use the Add New Task form:

Create Task A with Dependencies: (leave blank)

Create Task B with Dependencies: Task A

Create Task C with Dependencies: (leave blank)

Create Task D with Dependencies: Task B, Task C

Generate Schedule: Click the "Generate Recommended Schedule" button at the bottom of the page.

Verification: The output will show the tasks in the only valid execution order (e.g., Task A, Task C, Task B, Task D), proving the Topological Sort is correctly resolving the complex dependencies.
