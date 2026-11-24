    function openDeleteModal() { document.getElementById('deleteModal').classList.add('active'); }
    function closeDeleteModal() { document.getElementById('deleteModal').classList.remove('active'); }
    let addOpen = false
    function adicionar(){
      if (!addOpen){
      document.getElementById("addContainer").style.display = "flex";
      addOpen = true
      }
      else{
        document.getElementById("addContainer").style.display = "none";
        addOpen = false
      }
    }