import type { ApiAdapter } from "./ApiAdapter";
class ApiRegistry {
    private adapters = new Map<string, ApiAdapter>();
  
    register(adapter: ApiAdapter) {
      this.adapters.set(adapter.id, adapter);
    }
  
    list() {
      return Array.from(this.adapters.values());
    }
  
    get(id: string) {
      return this.adapters.get(id);
    }
  }
  
export const apiRegistry = new ApiRegistry();