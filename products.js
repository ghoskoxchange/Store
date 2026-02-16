document.addEventListener('DOMContentLoaded', async () => {
  const productList = document.getElementById('product-list');
  const { data: products } = await supabase.from('products').select('*');
  
  if (products && productList) {
    products.forEach(product => {
      const div = document.createElement('div');
      div.className = 'product-card';
      div.innerHTML = `
        <h3>${product.name}</h3>
        <p>${product.description || ''}</p>
        <p>₦${product.price}</p>
        <button onclick="addToCart(${product.id}, '${product.name}', ${product.price})">Add to Cart</button>
      `;
      productList.appendChild(div);
    });
  }
});