export const timestampToString = (timestamp) => {
  let date = (new Date(timestamp));
  return date.getHours()+":"+(date.getMinutes() < 10 ? '0' : '') + date.getMinutes()+" "+date.getDate()+"."+(date.getMonth()+1)+"."+date.getFullYear();
}
