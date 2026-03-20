/**
 * DATA-LOADER.JS - COMPLETE FIXED VERSION
 * Phones: phone-products folder
 * Other products: products folder
 */

const DataLoader = {
    basePath: 'data/',
    
    async loadCategories() {
        try {
            const response = await fetch(this.basePath + 'categories.json');
            return await response.json();
        } catch (error) {
            console.error('Error loading categories:', error);
            return ["All", "Vivo", "iPhone", "Samsung"];
        }
    },
    
    async loadTrending() {
        try {
            const response = await fetch(this.basePath + 'trending.json');
            return await response.json();
        } catch (error) {
            console.error('Error loading trending:', error);
            return [];
        }
    },
    
    async loadNewLaunch() {
        try {
            const response = await fetch(this.basePath + 'new-launch.json');
            return await response.json();
        } catch (error) {
            console.error('Error loading new launch:', error);
            return [];
        }
    },
    
    async loadPagination() {
        try {
            const response = await fetch(this.basePath + 'pagination.json');
            return await response.json();
        } catch (error) {
            console.error('Error loading pagination:', error);
            return { cardsPerPage: 20 };
        }
    },
    
    // ===== PHONE PRODUCTS IDs (phone-products folder) =====
    async loadPhoneProductIds() {
        return [
            // Mobiles
            
            'iphone-17',
            'iphone-17-pro',
            
            'samsung-A17-5G',
            
            
            'samsung-z-flip-7',
            'samsung-z-fold-7',
            'google-pixel-9A',
            "vivo-y31-pro",
            'google-pixel-10',
            
            'samsung-s25-ultra',
            'iphone-15',
           
            'samsung-A07-5G',
            
            
            'redmi-note-15-pro-plus',
            
            'realme-15',
            'redmi-15-c-5G',
           
            'google-pixel-10-pro-xl',
            'iphone-16',
            'iphone-16-plus',
            
            
            
            'moto-edge-70',
            'moto-G57',
            'oppo-reno-15-pro-mini',
            'samsung-s25-FE',
            'samsung-s26',
            "vivo-y31",
            'samsung-s26-ultra',
            
            'oppo-reno-15c-5G',
            'moto-edge-60',
            
           
            'realme-15-t-5G',
            'oppo-find-x9-pro',
            'oppo-reno-15-5G',
            
            
            'samsung-s26-plus',
            'realme-c83-5G',
            'realme-c85',
            'redmi-15-5G',
            'moto-edge-60-pro',
            "vivo-y19s-5G",
            'redmi-note-15-5G',
            'redmi-note-15-pro',
            'vivo-v60-E',
            
            'realme-16-pro-plus',
           
           
            'moto-G96',
            'moto-signature',
            'moto-edge-60-fusion',
            
            'oppo-A6-5G',
            
            'vivo-y400-pro-5G',
            'nothing-phone-3A-lite',
            'realme-15-x',
            'realme-16-pro',
            
            
            
            
            'oppo-F31',
            
            'oppo-find-x9',
            
            'nothing-phone-4A',
            'samsung-s25',
            'oppo-A6-pro',
            'oppo-A6x-5G',
            
            'oppo-reno-15-pro-5G',
            'vivo-v70-elite',
            'vivo-y400-5G',
            'google-pixel-10A',
            'google-pixel-10-pro',
            'iphone-air',
            
            'samsung-A36',
            'samsung-A56',
            'iphone-17-pro-max',
            'vivo-v70',
            'vivo-x300',
            'oppo-F31-pro',
            'oppo-F31-pro-plus',
            'nothing-phone-4A-pro'
            


            



        ];
    },
    
    // ===== OTHER PRODUCTS IDs (products folder) =====
    async loadOtherProductIds() {
        return [
            
            // Watches
            'apple-watch-se-3-1',
            'apple-watch-se-3-2',
            'apple-watch-se-3-3',
            'apple-watch-se-3-4',
            'apple-watch-series-11-1',
            'apple-watch-series-11-2',
            'apple-watch-series-11-3',
            'apple-watch-series-11-4',
            'apple-watch-series-11-5',
            'apple-watch-series-11-6',
            "apple-watch-ultra-3",
            
            // Laptops
            'mac-mini',
            'mac-mini-silver',
            'mackbook-air-13inch',
            'mackbook-air-15inch',
            'mackbook-neo',
            
            // Tablets
            'ipad-apple-11-gen',
            'redmi-pad-2-cellular',
            'samsung-tab-s-11-ultra',
            'redmi-pad-2',
            'samsung-tab-A-11-lte',
            'redmi-pad-2-pro',
            'samsung-tab-s-11-lte'
            
            
        ];
    },
    
    // ===== LOAD PRODUCT FROM SPECIFIC FOLDER =====
    async loadProductFromFolder(productId, folder) {
        try {
            const response = await fetch(`${this.basePath}${folder}/${productId}.json`);
            if (!response.ok) {
                return null;
            }
            return await response.json();
        } catch (error) {
            return null;
        }
    },
    
    // ===== LOAD PRODUCT (AUTO-DETECT FOLDER) =====
    async loadProduct(productId) {
        // Pehle phone-products folder mein dhundo
        let product = await this.loadProductFromFolder(productId, 'phone-products');
        if (product) return product;
        
        // Nahi mila to products folder mein dhundo
        product = await this.loadProductFromFolder(productId, 'products');
        if (product) return product;
        
        console.warn(`Product ${productId} not found in any folder`);
        return null;
    },
    
    // ===== LOAD PRODUCTS BY IDs =====
    async loadProducts(productIds) {
        const promises = productIds.map(id => this.loadProduct(id));
        const products = await Promise.all(promises);
        return products.filter(p => p !== null && p.status === 'active');
    },
    
    // ===== LOAD ALL PHONES (for homepage & products page) =====
    async loadAllPhones() {
        console.log('📱 Loading phones from phone-products folder...');
        const phoneIds = await this.loadPhoneProductIds();
        const products = await this.loadProducts(phoneIds);
        console.log(`Loaded ${products.length} phones`);
        return products;
    },
    
    // ===== LOAD ALL PRODUCTS (for other pages) =====
    async loadAllProducts() {
        const path = window.location.pathname;
        console.log('Loading for path:', path);
        
        // Homepage and products page - sirf phones
        if (path === '/' || path.includes('index.html') || path.includes('products.html')) {
            return this.loadAllPhones();
        }
        
        // Category pages ke liye
        if (window.currentCategory) {
            return this.loadProductsByCategory(window.currentCategory);
        }
        
        // Fallback - kuch nahi
        return [];
    },
    
    // ===== LOAD PRODUCTS BY CATEGORY =====
    async loadProductsByCategory(category) {
        console.log(`Loading products for category: ${category}`);
        
        // ⭐ FIXED: Special handling for Trending
        if (category === 'Trending') {
            const trendingIds = await this.loadTrending();
            console.log('Trending IDs:', trendingIds);
            return this.loadProducts(trendingIds);
        }
        
        // ⭐ FIXED: Special handling for New Launch
        if (category === 'New Launch') {
            const newLaunchIds = await this.loadNewLaunch();
            console.log('New Launch IDs:', newLaunchIds);
            return this.loadProducts(newLaunchIds);
        }
        
        // For other categories (TV, AC, etc.)
        const allOtherIds = await this.loadOtherProductIds();
        const products = await this.loadProducts(allOtherIds);
        
        // Filter by actual category field from JSON
        return products.filter(p => p.category === category);
    },
    
    // ===== SEARCH PRODUCTS =====
    async searchProducts(query) {
        const allProducts = await this.loadAllProducts();
        const lowerQuery = query.toLowerCase();
        
        return allProducts.filter(product => {
            return (
                product.name.toLowerCase().includes(lowerQuery) ||
                product.brand.toLowerCase().includes(lowerQuery) ||
                product.category.toLowerCase().includes(lowerQuery)
            );
        });
    }
};

window.DataLoader = DataLoader;