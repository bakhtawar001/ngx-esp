# Quill

Quill is a lightweight API driven rich text editor that is highly configurable.

## Example Markup

```angular
<quill-editor>
  <div quill-editor-toolbar>
    <span class="ql-formats">
      <button class="ql-bold" [title]="'Bold'"></button>
    </span>
    <span class="ql-formats">
      <select class="ql-align" [title]="'Aligment'">
        <option selected></option>
        <option value="center"></option>
        <option value="right"></option>
        <option value="justify"></option>
      </select>
      <select class="ql-align" [title]="'Aligment2'">
        <option selected></option>
        <option value="center"></option>
        <option value="right"></option>
        <option value="justify"></option>
      </select>
    </span>
  </div>
</quill-editor>
```

## More Reading

[Ngx Quill](https://github.com/KillerCodeMonkey/ngx-quill) -

[Quill JS](https://quilljs.com/)
