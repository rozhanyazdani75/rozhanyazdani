/**
 * Blog Management System
 * Automatically reads HTML files from blogs folder and displays them
 */

class BlogManager {
    constructor() {
        this.posts = [];
        this.filteredPosts = [];
        this.currentPage = 1;
        this.postsPerPage = 6;
        this.currentFilter = 'all';
        this.searchQuery = '';
        
        this.init();
    }

    async init() {
        await this.loadBlogPosts();
        this.setupEventListeners();
        this.displayPosts();
    }

    async loadBlogPosts() {
        try {
            const blogFiles = await this.getBlogFilesList();
            
            for (const fileName of blogFiles) {
                try {
                    const response = await fetch(`blogs/${fileName}`);
                    if (response.ok) {
                        const htmlContent = await response.text();
                        const postData = this.extractPostData(htmlContent, fileName);
                        if (postData) {
                            this.posts.push(postData);
                        }
                    }
                } catch (error) {
                    console.warn(`Error loading file ${fileName}:`, error);
                }
            }
            
            this.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
            this.filteredPosts = [...this.posts];
            
        } catch (error) {
            console.error('Error loading blog posts:', error);
            this.showNoResults('خطا در بارگذاری مقالات');
        }
    }

    async getBlogFilesList() {
        const blogFiles = [];
        
        for (let i = 1; i <= 50; i++) {
            const fileName = `blog${i}.html`;
            try {
                const response = await fetch(`blogs/${fileName}`, { method: 'HEAD' });
                if (response.ok) {
                    blogFiles.push(fileName);
                }
            } catch (error) {
                break;
            }
        }
        
        return blogFiles;
    }

    extractPostData(htmlContent, fileName) {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlContent, 'text/html');
            
            const title = doc.querySelector('meta[name="blog-title"]')?.content || 
                         doc.querySelector('title')?.textContent || 'بدون عنوان';
            
            const excerpt = doc.querySelector('meta[name="blog-excerpt"]')?.content || 
                           doc.querySelector('meta[name="description"]')?.content || '';
            
            const category = doc.querySelector('meta[name="blog-category"]')?.content || 'عمومی';
            const tags = doc.querySelector('meta[name="blog-tags"]')?.content?.split(',') || [];
            const date = doc.querySelector('meta[name="blog-date"]')?.content || new Date().toISOString();
            const image = doc.querySelector('meta[name="blog-image"]')?.content || '';
            const author = doc.querySelector('meta[name="blog-author"]')?.content || 'روژان یزدانی';
            
            return {
                title: title.trim(),
                excerpt: excerpt.trim(),
                category: category.trim(),
                tags: tags.map(tag => tag.trim()).filter(tag => tag),
                date: date,
                image: image,
                author: author.trim(),
                fileName: fileName,
                url: `blogs/${fileName}`
            };
        } catch (error) {
            console.error(`Error extracting data from ${fileName}:`, error);
            return null;
        }
    }

    setupEventListeners() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase();
                this.filterAndDisplayPosts();
            });
        }

        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                this.currentFilter = e.target.dataset.category;
                this.filterAndDisplayPosts();
            });
        });
    }

    filterAndDisplayPosts() {
        this.filteredPosts = this.posts.filter(post => {
            const categoryMatch = this.currentFilter === 'all' || 
                                post.category.toLowerCase().includes(this.currentFilter) ||
                                post.tags.some(tag => tag.toLowerCase().includes(this.currentFilter));
            
            const searchMatch = this.searchQuery === '' ||
                              post.title.toLowerCase().includes(this.searchQuery) ||
                              post.excerpt.toLowerCase().includes(this.searchQuery) ||
                              post.tags.some(tag => tag.toLowerCase().includes(this.searchQuery));
            
            return categoryMatch && searchMatch;
        });

        this.currentPage = 1;
        this.displayPosts();
    }

    displayPosts() {
        const blogGrid = document.getElementById('blogGrid');
        if (!blogGrid) return;

        const startIndex = (this.currentPage - 1) * this.postsPerPage;
        const endIndex = startIndex + this.postsPerPage;
        const currentPosts = this.filteredPosts.slice(startIndex, endIndex);

        if (currentPosts.length === 0) {
            this.showNoResults();
            return;
        }

        blogGrid.innerHTML = currentPosts.map(post => this.createPostCard(post)).join('');
        this.displayPagination();
        this.animateCards();
    }

    createPostCard(post) {
        const formattedDate = this.formatDate(post.date);
        const imageHtml = post.image ? 
            `<img src="${post.image}" alt="${post.title}">` : 
            `<i class="fas fa-file-alt"></i>`;

        return `
            <article class="blog-card">
                <div class="blog-card-image">
                    ${imageHtml}
                </div>
                <div class="blog-card-content">
                    <div class="blog-card-meta">
                        <div class="blog-card-date">
                            <i class="fas fa-calendar-alt"></i>
                            <span>${formattedDate}</span>
                        </div>
                        <div class="blog-card-category">${post.category}</div>
                    </div>
                    <h3 class="blog-card-title">${post.title}</h3>
                    <p class="blog-card-excerpt">${post.excerpt}</p>
                    <div class="blog-card-footer">
                        <a href="${post.url}" class="read-more-btn">
                            ادامه مطلب
                            <i class="fas fa-arrow-left"></i>
                        </a>
                        <div class="blog-card-tags">
                            ${post.tags.slice(0, 3).map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                </div>
            </article>
        `;
    }

    displayPagination() {
        const pagination = document.getElementById('pagination');
        if (!pagination) return;

        const totalPages = Math.ceil(this.filteredPosts.length / this.postsPerPage);
        
        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        let paginationHTML = '';
        
        if (this.currentPage > 1) {
            paginationHTML += `<button class="pagination-btn" onclick="blogManager.goToPage(${this.currentPage - 1})">
                <i class="fas fa-chevron-right"></i>
            </button>`;
        }

        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(totalPages, this.currentPage + 2);

        for (let i = startPage; i <= endPage; i++) {
            const activeClass = i === this.currentPage ? 'active' : '';
            paginationHTML += `<button class="pagination-btn ${activeClass}" onclick="blogManager.goToPage(${i})">${i}</button>`;
        }

        if (this.currentPage < totalPages) {
            paginationHTML += `<button class="pagination-btn" onclick="blogManager.goToPage(${this.currentPage + 1})">
                <i class="fas fa-chevron-left"></i>
            </button>`;
        }

        pagination.innerHTML = paginationHTML;
    }

    goToPage(page) {
        this.currentPage = page;
        this.displayPosts();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    showNoResults(message = 'هیچ مقاله‌ای یافت نشد') {
        const blogGrid = document.getElementById('blogGrid');
        if (!blogGrid) return;

        blogGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>نتیجه‌ای یافت نشد</h3>
                <p>${message}</p>
            </div>
        `;

        const pagination = document.getElementById('pagination');
        if (pagination) {
            pagination.innerHTML = '';
        }
    }

    formatDate(dateString) {
        try {
            const date = new Date(dateString);
            const persianMonths = [
                'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
                'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
            ];
            
            const persianDate = new Intl.DateTimeFormat('fa-IR').format(date);
            return persianDate;
        } catch (error) {
            return 'تاریخ نامشخص';
        }
    }

    animateCards() {
        const cards = document.querySelectorAll('.blog-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
}

let blogManager;

document.addEventListener('DOMContentLoaded', () => {
    blogManager = new BlogManager();
});