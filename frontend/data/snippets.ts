// frontend/data/snippets.ts

// export const JIO_WORK_SNIPPET_FALLBACK = `package main

// import (
// 	"context"
// 	"fmt"

// 	"github.com/reliance/jio-core/sre"
// )

// // ScaleService handles automated scaling for Jio backend portals.
// func ScaleService(ctx context.Context, clusterID string) error {
// 	fmt.Printf("SRE Anuj: Monitoring health for %s...\\n", clusterID)

// 	// Placeholder logic for gRPC health checks and Azure scaling.
// 	return sre.TriggerAutoscale(ctx, clusterID, 100)
// }
// `

export const JIO_WORK_SNIPPET_FALLBACK = `
    package main

    import (
      "context"
      "errors"
      "fmt"
      "log"
      "math/rand"
      "sync"
      "time"

      "github.com/reliance/jio-core/sre"
      "google.golang.org/grpc"
      "google.golang.org/grpc/credentials/insecure"
    )

    // Constants for SRE Thresholds
    const (
      MaxRetries       = 3
      ScalingThreshold = 0.85
      AzureRegion      = "india-west"
    )

    // ServiceHealth represents the telemetry data for a Jio backend node.
    type ServiceHealth struct {
      ClusterID   string
      CPUUsage    float64
      MemoryUsage float64
      ActiveGRPC  int
      IsHealthy   bool
    }

    // ResourceManager manages the state of active clusters at Jio.
    type ResourceManager struct {
      mu       sync.RWMutex
      clusters map[string]*ServiceHealth
    }

    // NewResourceManager initializes the SRE monitoring state.
    func NewResourceManager() *ResourceManager {
      return &ResourceManager{
        clusters: make(map[string]*ServiceHealth),
      }
    }

    // CheckClusterHealth performs a mock gRPC health check.
    func (rm *ResourceManager) CheckClusterHealth(ctx context.Context, clusterID string) (*ServiceHealth, error) {
      log.Printf("[SRE-ANUJ] Initiating health check for cluster: %s", clusterID)

      // Simulated gRPC connection setup
      conn, err := grpc.Dial("localhost:50051", grpc.WithTransportCredentials(insecure.NewCredentials()))
      if err != nil {
        return nil, fmt.Errorf("failed to connect to cluster gRPC: %w", err)
      }
      defer conn.Close()

      // Mocking telemetry data retrieval
      health := &ServiceHealth{
        ClusterID:   clusterID,
        CPUUsage:    rand.Float64(),
        MemoryUsage: rand.Float64(),
        ActiveGRPC:  rand.Intn(1000),
        IsHealthy:   true,
      }

      rm.mu.Lock()
      rm.clusters[clusterID] = health
      rm.mu.Unlock()

      return health, nil
    }

    // ScaleService handles automated scaling logic for backend portals.
    func (rm *ResourceManager) ScaleService(ctx context.Context, clusterID string) error {
      health, err := rm.CheckClusterHealth(ctx, clusterID)
      if err != nil {
        return err
      }

      if health.CPUUsage > ScalingThreshold {
        log.Printf("[SRE-ALERT] CPU Usage at %.2f%%. Triggering Azure Autoscale...", health.CPUUsage*100)
        
        // Azure Orchestration Logic via Jio SRE Core
        err := sre.TriggerAutoscale(ctx, clusterID, 100)
        if err != nil {
          return fmt.Errorf("autoscale failed for %s: %v", clusterID, err)
        }
        
        log.Printf("[SRE-SUCCESS] Cluster %s scaled successfully in %s", clusterID, AzureRegion)
      } else {
        log.Printf("[SRE-INFO] Cluster %s is within nominal limits.", clusterID)
      }

      return nil
    }

    // MonitorLoop runs a continuous background check, similar to a K8s controller.
    func MonitorLoop(ctx context.Context, rm *ResourceManager, interval time.Duration) {
      ticker := time.NewTicker(interval)
      defer ticker.Stop()

      for {
        select {
        case <-ctx.Done():
          return
        case <-ticker.C:
          clusters := []string{"jio-portal-01", "jio-my-app-02", "jio-5g-core-03"}
          for _, id := range clusters {
            if err := rm.ScaleService(ctx, id); err != nil {
              log.Printf("[ERROR] Monitoring failed for %s: %v", id, err)
            }
          }
        }
      }
    }

    func main() {
      fmt.Println("---------------------------------------------------------")
      fmt.Println(" Jio SRE Automated Scaling Agent - Version 1.0.4-stable  ")
      fmt.Println(" Engineer: Anuj Tiwari                                   ")
      fmt.Println("---------------------------------------------------------")

      ctx, cancel := context.WithCancel(context.Background())
      defer cancel()

      manager := NewResourceManager()
      
      // Start the monitoring engine
      go MonitorLoop(ctx, manager, 5*time.Second)

      // Keep the process alive (mocking a long-running service)
      log.Println("[SYSTEM] Scaling Agent is active and listening...")
      select {} 
    }
`;