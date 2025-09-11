async function api(path, opts={}){
  const key = document.getElementById('adminkey').value || '';
  const headers = opts.headers || {};
  if (key) headers['x-admin-key'] = key;
  const res = await fetch(path, {...opts, headers});
  if (!res.ok) throw new Error(await res.text());
  return res;
}

document.getElementById('load').addEventListener('click', async ()=>{
  try{
    const res = await api('/admin/data');
    const data = await res.json();
    const tbody = document.querySelector('#tbl tbody');
    tbody.innerHTML = '';
    data.forEach((s,i)=>{
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${i+1}</td><td>${s.fullName||''}</td><td>${s.mssv||''}</td><td>${s.lopHoc||''}</td><td>${s.ngaySinh||''}</td><td>${s.cccd||''}</td>`;
      tbody.appendChild(tr);
    });
    document.getElementById('message').innerHTML = `<div class="alert alert-success">Loaded ${data.length} records</div>`;
  }catch(err){
    document.getElementById('message').innerHTML = `<div class="alert alert-danger">${err.message}</div>`;
  }
});

document.getElementById('export').addEventListener('click', async ()=>{
  try{
    const key = document.getElementById('adminkey').value || '';
    const url = '/admin/export' + (key?('?key='+encodeURIComponent(key)):'');
    window.location = url;
  }catch(err){
    document.getElementById('message').innerHTML = `<div class="alert alert-danger">${err.message}</div>`;
  }
});

document.getElementById('deleteAll').addEventListener('click', async ()=>{
  if(!confirm('Xác nhận xóa tất cả dữ liệu?')) return;
  try{
    await api('/admin/delete-all',{method:'POST'});
    document.querySelector('#tbl tbody').innerHTML = '';
    document.getElementById('message').innerHTML = `<div class="alert alert-success">Đã xóa tất cả</div>`;
  }catch(err){
    document.getElementById('message').innerHTML = `<div class="alert alert-danger">${err.message}</div>`;
  }
});
