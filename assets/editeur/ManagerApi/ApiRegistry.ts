import type { ApiAdapter, ApiAdapterType } from "./ApiAdapter";
class ApiRegistry {
    private adapters = new Map<string, ApiAdapter>();
  
    register(adapter: ApiAdapter) {
      this.adapters.set(adapter.id, adapter);
    }
  
    list() {
      return Array.from(this.adapters.values());
    }

    listByType(type: ApiAdapterType) {
      return this.list().filter((adapter) => adapter.type === type);
    }
  
    get(id: string) {
      return this.adapters.get(id);
    }
  }
  
export const apiRegistry = new ApiRegistry();