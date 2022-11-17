import Dataloader from "dataloader";
import { api } from "../../lib/index.js";

export const userDataLoader = () => {
   return new Dataloader(async (ids) => {
      const urlQuery = ids.join("&id=");
      const response = await api.get(`/users/?id=${urlQuery}`)

      const userData = await response.data;

      return ids.map(id => userData.find(user => user.id === id));
   })
}
