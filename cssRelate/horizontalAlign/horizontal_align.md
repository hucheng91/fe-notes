# 水平对齐

 ## 块元素

 -   margin auto 中间对齐
```css
这个主要针对 position relative，static 
.center 
{ 
margin-left:auto; 
margin-right:auto; 
width:70%; 
background-color:#b0e0e6; 
}
```
- 右对齐 / 左对齐
```css
// 绝对布局方式
.right 
{ 
position:absolute; 
right:0px; 
width:300px; 
background-color:#b0e0e6; 
}
// float 方式
.right 
{ 
float:right; 
width:300px; 
background-color:#b0e0e6; 
}
```


## 垂直
 - 垂直对齐 简单的padding
```css
.center {
    padding: 70px 0;
    border: 3px solid green;
}
```

- 垂直居中对齐
```css
.center {
    padding: 70px 0;
    border: 3px solid green;
    text-align: center;
}

```