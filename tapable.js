import { SyncHook, AsyncParallelHook } from 'tapable';

// 1、同步hook，其他类型详见https://github.com/webpack/tapable
const hook = new SyncHook(['shen']); // 传入的数组为参数名称
// 注册
hook.tap('xx', (param) => {
  console.log('sync: ', { param });
});
// 触发
hook.call(1);

// 2、异步hook
const asyncHook = new AsyncParallelHook(['shen']);
// 注册
asyncHook.tapPromise('yy', (param) => {
  console.log('async: ', { param });
  // 需要返回promise
  return Promise.resolve(param);
});
asyncHook.promise(2)
