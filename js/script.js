document.getElementById('btnArchivos').addEventListener('click', () =>{
    document.getElementById('archivo').click();
});

document.getElementById('archivo').addEventListener('change', async function(){
    const file = this.files[0];
    if(!file) return;

    const formData = new FormData();
    formData.append('archivo', file);

    try{
        const response = await fetch('http://localhost:3000/upload', {
            method: 'POST',
            body: formData
        });

        const result = await response.text();
        alert(result);
    }catch(error){
        alert('Error al subir el archivo');
    }
});