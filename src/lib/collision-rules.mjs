/* Shared scene boundary and obstacle rules for cub movement. */
export function isBlocked(loc,x,y){
 if(x<32||x>738||y<133||y>411)return true;
 if(loc==='den'&&x>399&&x<522&&y>267&&y<311)return true;
 if(loc==='post'&&x>124&&x<276&&y>282&&y<348)return true;
 return false;
}
