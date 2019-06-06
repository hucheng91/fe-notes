

/**
* 可以看到 a 只能在 if 这个大括号里面访问，{ } 组成了一个块级作用域
**/
public class HelloWorld {
    public static void main(String[] args) {
        Boolean isGo = true;
        if(isGo){
         String a = "blue";
         System.out.println(a);
        }

       System.out.println(a);  // error
    }
}