import { describe, it, expect } from 'vitest';
import { count, quantity, add, canPay, spend } from '../src/lib/inventory-rules.mjs';

describe('production inventory module and legacy semantics', () => {
  it('matches prior quantity/count behavior for ordinary items', () => {
    expect(count({berry:3,stick:1,broken:NaN})).toBe(4);
    expect(quantity({berry:3},'missing')).toBe(0);
    expect(quantity({berry:-4},'berry')).toBe(0);
  });
  it('preserves item quantities across a reciprocal trade', () => {
    const a={berry:5,stick:1},b={fish:2,berry:1};
    const before={berry:6,stick:1,fish:2};
    spend(a,{berry:2});spend(b,{fish:1});
    add(a,'fish',1);add(b,'berry',2);
    for(const id of Object.keys(before))
      expect((a[id]||0)+(b[id]||0)).toBe(before[id]);
    expect(a.fish).toBe(1);
    expect(b.berry).toBe(3);
  });
  it('removes depleted entries and rejects paying more than available', () => {
    const stock={fish:1,berry:2};
    expect(canPay(stock,{fish:2})).toBe(false);
    expect(canPay(stock,{fish:1})).toBe(true);
    spend(stock,{fish:1});
    expect('fish' in stock).toBe(false);
    expect(count(stock)).toBe(2);
  });
  it('behaves identically to the original inventory functions across 10k operations', () => {
    let seed=19237;
    const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
    const ids=['berry','twig','fish','stick','leaf','amber'];
    for(let i=0;i<10000;i++){
      const inv={};
      for(const id of ids)inv[id]=Math.floor(rand()*10);
      const expected={...inv},actual={...inv};
      const item=ids[Math.floor(rand()*ids.length)];
      const amount=Math.floor(rand()*12)-6;
      const next=Math.max(0,Number(expected[item]||0))+amount;
      if(next<=0)delete expected[item];else expected[item]=next;
      add(actual,item,amount);
      expect(actual).toEqual(expected);
      const total=Object.values(expected).reduce((a,v)=>a+(Number.isFinite(v)?v:0),0);
      expect(count(actual)).toBe(total);
      const cost={[item]:Math.floor(rand()*12)};
      expect(canPay(actual,cost)).toBe(Math.max(0,Number(actual[item]||0))>=cost[item]);
    }
  });
});
