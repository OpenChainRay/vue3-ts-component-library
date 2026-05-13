// 相同类型元素组成成为数组，不同类型元素组成了元组（Tuple）。

// 元组中规定的元素类型顺序必须是完全对照的，而且不能多、不能少，list1 中定义的第一个元素为 string类型，
// 不能赋值为 number类型的数据。

// const list: [string, number] = ['Sherlock', 1887]   // ok

// const list1: [string, number] = [1887, 'Sherlock']  // error
// console.log(list)
// console.log(list1)

// const list2: [string, number] = ['Sherlock', 1887]

// list2[0].substr(1)  // ok
// list2[1].substr(1)  // Property 'substr' does not exist on type 'number'.

// 元组类型允许在元素类型后缀一个 ? 来说明元素是可选的：
// 选元素必须在必选元素的后面，也就是如果一个元素后缀了 ?号，其后的所有元素都要后缀 ?号。
let list: [number, string?, boolean?]
list = [10, 'Sherlock', true]
list = [10, 'Sherlock']
list = [10]


// 元组可以作为参数传递给函数，函数的 Rest 形参可以定义为元组类型：
// TIPS： 在声明文件（.d.ts）中，关键字 declare 表示声明作用。声明文件用于编写第三方类库，
// 通过配置 tsconfig.json 文件中的 declaration 为 true，在编译时可自行生成。

// declare function rest(...args: [number, string, boolean]): void
// 等价于： declare function rest(arg1: number, arg2: string, arg3: boolean): void

