import { ApiService } from '../api.service';
import { RequestCacheService} from '../request-cache.service'

export abstract class AbstractWidget  {


  constructor(protected _apiService: ApiService, protected _cache: RequestCacheService) { }

}
