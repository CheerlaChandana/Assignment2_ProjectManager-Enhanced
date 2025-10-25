using ProjectManagerApi.Dtos;
using ProjectManagerApi.Models;
using System.Text.Json; // For JSON parsing

namespace ProjectManagerApi.Services
{
    public interface ISchedulerService
    {
        ScheduleResponse GenerateSchedule(List<ProjectTask> tasks);
    }

    public class SchedulerService : ISchedulerService
    {
        public ScheduleResponse GenerateSchedule(List<ProjectTask> tasks)
        {
            // 1. Initialize data structures
            var graph = new Dictionary<string, List<string>>(); // Task Title -> Dependent Task Titles
            var inDegree = new Dictionary<string, int>();       // Task Title -> Count of dependencies

            // Prepare all task names and initial dependencies (0)
            foreach (var task in tasks)
            {
                graph[task.Title] = new List<string>();
                inDegree[task.Title] = 0;
            }

            // A map to quickly look up task dependencies and estimated time (for future priority sorting)
            var taskMap = tasks.ToDictionary(t => t.Title, t => t);

            // 2. Build the Graph and Calculate In-Degrees
            foreach (var task in tasks)
            {
                // Parse the DependenciesJson field (e.g., "['Task A', 'Task B']")
                List<string> dependencies;
                try
                {
                    dependencies = JsonSerializer.Deserialize<List<string>>(task.DependenciesJson);
                }
                catch
                {
                    dependencies = new List<string>();
                }
                
                foreach (var dependencyTitle in dependencies)
                {
                    // Check if the dependency task actually exists in the project
                    if (taskMap.ContainsKey(dependencyTitle))
                    {
                        // Add edge: DependencyTitle -> Task.Title
                        graph[dependencyTitle].Add(task.Title);
                        inDegree[task.Title]++;
                    }
                }
            }

            // 3. Initialize Queue with all tasks that have no dependencies (In-Degree = 0)
            var queue = new Queue<string>();
            foreach (var pair in inDegree)
            {
                if (pair.Value == 0)
                {
                    queue.Enqueue(pair.Key);
                }
            }

            // 4. Process the queue (Topological Sort)
            var recommendedOrder = new List<string>();
            while (queue.Count > 0)
            {
                string currentTaskTitle = queue.Dequeue();
                recommendedOrder.Add(currentTaskTitle);

                // For every task that depends on the current task
                foreach (var dependentTaskTitle in graph[currentTaskTitle])
                {
                    inDegree[dependentTaskTitle]--;

                    // If a dependent task has no remaining dependencies, add it to the queue
                    if (inDegree[dependentTaskTitle] == 0)
                    {
                        // **NOTE:** This is where priority sorting would be added. 
                        // For now, it's just added to the queue, resulting in an arbitrary order for tasks at the same level.
                        queue.Enqueue(dependentTaskTitle);
                    }
                }
            }
            
            // 5. Cycle Detection
            if (recommendedOrder.Count != tasks.Count)
            {
                throw new InvalidOperationException("Circular dependency detected in tasks. A valid schedule cannot be generated.");
            }

            return new ScheduleResponse { RecommendedOrder = recommendedOrder };
        }
    }
}