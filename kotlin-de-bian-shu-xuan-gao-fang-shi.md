---
description: 闖蕩江湖第一式：類型推斷
cover: >-
  https://images.unsplash.com/photo-1454496522488-7a8e488e8606?crop=entropy&cs=tinysrgb&fm=jpg&ixid=MnwxOTcwMjR8MHwxfHNlYXJjaHwzfHxtb3VudGFpbnxlbnwwfHx8fDE2NTkzNDAwNTI&ixlib=rb-1.2.1&q=80
coverY: 0
---

# Kotlin的變數宣告方式

以往在Java當中宣告一個變數都是這樣的:

```
int test = 1;
```

但現在到了kotlin,為了更簡潔/方便,可以這樣宣告

```
var test = 1
```

什麼！你說你要宣告一個定值不是變數？

```
val test = 1 // 往後就不能改變test的值
```

為什麼kotlin 可以這樣宣告? 因為這也是他最大的特色: 類型推斷(很多比較新的語言都有這種特性)

