import Dataloader from "dataloader";

export const userDataLoader = (getUsers) => {
   return new Dataloader(async (ids) => {
      const urlQuery = ids.join("&id=");
      const userData = await getUsers(`?id=${urlQuery}`)

      return ids.map(id => userData.find(user => user.id === id));
   })
}
