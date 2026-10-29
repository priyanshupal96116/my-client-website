const search=document.getElementById('chapterSearch');
if(search)search.addEventListener('input',function(){
  const v=this.value.trim().toLowerCase();
  document.querySelectorAll('.chapter-card').forEach(c=>{
    const keywords=(c.dataset.search||'').trim().toLowerCase();
    c.style.display=keywords.includes(v)?'flex':'none';
  });
});