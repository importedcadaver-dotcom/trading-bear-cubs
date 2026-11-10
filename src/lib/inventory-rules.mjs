/* Authoritative inventory helpers shared by the actual offline game and Vitest.
   Semantics preserved from the original v1 economy functions. */
export function count(inv){
  return Object.values(inv).reduce((sum,v)=>sum+(Number.isFinite(v)?v:0),0);
}
export function quantity(inv,key){
  return Math.max(0,Number(inv[key]||0));
}
export function add(inv,key,amount=1){
  const next=quantity(inv,key)+amount;
  if(next<=0)delete inv[key];
  else inv[key]=next;
}
export function canPay(inv,cost){
  return Object.entries(cost).every(([key,n])=>quantity(inv,key)>=n);
}
export function spend(inv,cost){
  for(const [key,n] of Object.entries(cost))add(inv,key,-n);
}
