---
description: 讓你不再一招半式闖江湖
cover: >-
  https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?crop=entropy&cs=tinysrgb&fm=jpg&ixid=MnwxOTcwMjR8MHwxfHNlYXJjaHw3fHxzZWF8ZW58MHx8fHwxNjU5MzMxMTI3&ixlib=rb-1.2.1&q=80
coverY: 0
---

# Kotlin的Singleton三種寫法

先說說Singleton吧！

如果我們要在很多不同的地方呼叫同一個東西,​這時侯如果到處new可能造成記憶體外洩(memory leaks),因此就出現一個設計模式-單例(Singleton),那先來看看Java怎麼寫好了：

以下引用 [https://skyyen999.gitbooks.io/-study-design-pattern-in-java/content/singleton.html](https://skyyen999.gitbooks.io/-study-design-pattern-in-java/content/singleton.html)

```
public class Singleton {
    private static Singleton instance;


    private Singleton(){
        // 這裡面跑很了多code，建立物件需要花費很多資源
    }

    // 多執行緒時，當物件需要被建立時才使用synchronized保證Singleton一定是單一的 ，增加程式校能
    public static Singleton getInstance(){
        if(instance == null){
            synchronized(Singleton.class){
                if(instance == null){
                    instance = new Singleton();
                }    
            }
        } 
        return instance;
    }
}
```

至於Kotlin該怎麼寫呢？以下帶來三種寫法

* @JvmStatic -> companion object 的 annotation 加入則類似Java當中的靜態類別(static)

```
class test {
    @JvmStatic
    companion object {
       // write something here
    }
}
```

* Companion object -> 伴生物件,跟隨class生成,外部呼叫只能呼叫companion object內的變數或function

```
class test {
    companion object {
       // write something here
    }
}
```

* Object -> 直接宣告成object 在外面就可以直接呼叫囉! 適合SDK這種

```
object test {
    fun isPen() : boolean {
        return true
    }
}
```

也許你對於是否要加@JvmStatic有些疑惑,以下可以解答你的問題：

### Behind the scenes without `@JvmStatic`

**Kotlin code**

```kotlin
class Plant {
    companion object {
        fun waterAll() { }
    }
}
```

**Decompiled Java code**

```java
public final class Plant {

   public static final Plant.Companion Companion = new Plant.Companion();

   public static final class Companion {

      public final void waterAll() { }

      private Companion() { }
   }
}
```

As you can see in the simplified decompiled Java code above, a class named `Companion` is generated to represent the `companion object`. The class `Plant` holds the singleton instance `new Plant.Companion()` of the class `Plant.Companion`. The instance is also named as `Companion`. This is the reason you need to call the functions/properties of the `companion object` in Java using the `Plant.Companion`:

```scss
Plant.Companion.waterAll();
```

***

### Behind the scenes with `@JvmStatic`

**Kotlin code**

```kotlin
class Plant {
    companion object {
        @JvmStatic
        fun waterAll() { }
    }
}
```

**Decompiled Java code**

```java
public final class Plant {

   public static final Plant.Companion Companion = new Plant.Companion();

   @JvmStatic
   public static final void waterAll() { Companion.waterAll();}

   public static final class Companion {
      @JvmStatic
      public final void waterAll() { }

      private Companion() { }
   }
}
```

When you annotate a function of a `companion object` with `@JvmStatic` in Kotlin, a pure `static` function `waterAll()` is generated in addition to the non static function `waterAll()`. So, now you are able to call the function without the `Companion` name which is more idiomatic to Java:

```scss
Plant.waterAll();
```

***

### Singleton

The singleton pattern is generated in both cases. As you can see, in both cases, the `Companion` instance holds the singleton object `new Plant.Companion()` and the constructor is made `private` to prevent multiple instances.

The Java `static` keyword does not create the singletons. You will get the singleton feature only if you create a `companion object` in Kotlin and then use it from Java. To get singleton from Java, you'll need to write the singleton pattern, the code for which looks like the decompiled Java code shown above.

***

### Performance

There is no performance gain or loss in terms of memory allocation. The reason is that, as you can see in the code above, the extra `static` function that is generated delegates its work to the non static function `Companion.waterAll()`. This means, creation of the `Companion` instance is required in both the cases, with `@JvmStatic` as well as without `@JvmStatic`.

The behaviour of both the setups is the same apart from the extra method that is generated. In Android, if you worry about the method count, you may need to keep an eye on this because an extra copy is created for each annotated function.

***

### When to use `@JvmStatic`

**When you know that **<mark style="color:blue;">**your Kotlin code won't be used in Java**</mark>**, you don't have to worry about adding the `@JvmStatic` annotation. This keeps your code cleaner. However, **<mark style="color:red;">**if your Kotlin code is called from Java**</mark>**, it makes sense to add the annotation.** This will prevent your Java code from polluting with the name `Companion` everywhere.

It's not like an additional keyword on either side. If you add `@JvmStatic` in one place, you can prevent writing the extra `Companion` word in thousands of places, wherever you call that function. This is especially useful for library creators, if they add `@JvmStatic` in their Kotlin library, the users of that library won't have to use the `Companion` word in their Java code.

***
