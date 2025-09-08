import React, { useEffect } from 'react';

interface ImagePreviewProps {
  enableLogs?: boolean;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ enableLogs = false }) => {
  useEffect(() => {
    if (enableLogs) {
      console.log('🖼️ Image Preview: Component loaded, initializing JavaScript');
    }

    // Embed JavaScript code directly in the component
    const initImagePreview = () => {
      // Function for conditional logging
      const log = (...args: any[]) => {
        if (enableLogs) {
          console.log(...args);
        }
      };

      log('🖼️ Image Preview: Initialization started');

      // Create modal window
      function createModal() {
        const modal = document.createElement('div');
        modal.id = 'image-preview-modal';
        modal.innerHTML = `
          <div class="modal-overlay">
            <div class="modal-content">
              <span class="modal-close">&times;</span>
              <img class="modal-image" src="" alt="">
              <div class="modal-caption"></div>
            </div>
          </div>
        `;
        document.body.appendChild(modal);
        return modal;
      }

      // CSS styles for modal window
      function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
          #image-preview-modal {
            display: none;
            position: fixed;
            z-index: 10000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            animation: fadeIn 0.3s ease;
          }

          #image-preview-modal.show {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .modal-overlay {
            position: relative;
            max-width: 90%;
            max-height: 90%;
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .modal-content {
            position: relative;
            background: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            max-width: 100%;
            max-height: 100%;
            overflow: auto;
          }

          .modal-close {
            position: absolute;
            top: 10px;
            right: 15px;
            color: #aaa;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
            z-index: 10001;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 50%;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
          }

          .modal-close:hover,
          .modal-close:focus {
            color: #000;
            background: rgba(255, 255, 255, 1);
          }

          .modal-image {
            max-width: 100%;
            max-height: 80vh;
            height: auto;
            width: auto;
            display: block;
            margin: 0 auto;
            border-radius: 4px;
          }

          .modal-caption {
            text-align: center;
            margin-top: 10px;
            font-size: 14px;
            color: #666;
            font-style: italic;
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          .modal-image {
            animation: zoomIn 0.3s ease;
          }

          @keyframes zoomIn {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }

          @media (max-width: 768px) {
            .modal-content {
              margin: 20px;
              padding: 15px;
            }
            
            .modal-image {
              max-height: 70vh;
            }
          }
        `;
        document.head.appendChild(style);
      }

      // Show modal window
      function showModal(imageSrc, imageAlt) {
        log('🖼️ Image Preview: Showing modal window', { imageSrc, imageAlt });
        
        const modal = document.getElementById('image-preview-modal');
        const modalImage = modal.querySelector('.modal-image');
        const modalCaption = modal.querySelector('.modal-caption');
        
        modalImage.src = imageSrc;
        modalImage.alt = imageAlt;
        modalCaption.textContent = imageAlt || 'Image';
        
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        log('🖼️ Image Preview: Modal window shown');
      }

      // Hide modal window
      function hideModal() {
        log('🖼️ Image Preview: Hiding modal window');
        
        const modal = document.getElementById('image-preview-modal');
        modal.classList.remove('show');
        document.body.style.overflow = '';
        
        log('🖼️ Image Preview: Modal window hidden');
      }

      // Check if file is an image
      function isImageFile(url) {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
        const lowerUrl = url.toLowerCase();
        
        log('🖼️ Image Preview: Checking URL:', url);
        
        const hasImageExtension = imageExtensions.some(ext => lowerUrl.includes(ext));
        log('🖼️ Image Preview: Has image extension:', hasImageExtension);
        
        // Remove check for ending with /, as Docusaurus adds / to image URLs
        const isNotHtmlPage = !lowerUrl.includes('.html');
        log('🖼️ Image Preview: Not HTML page:', isNotHtmlPage);
        
        const result = hasImageExtension && isNotHtmlPage;
        log('🖼️ Image Preview: Final result:', result);
        
        return result;
      }

      // Add styles
      addStyles();
      log('🖼️ Image Preview: Styles added');
      
      // Create modal window
      const modal = createModal();
      log('🖼️ Image Preview: Modal window created');
      
      // Click handler for image links
      document.addEventListener('click', function(e) {
        log('🖼️ Image Preview: Click registered', e.target);
        
        const link = e.target.closest('a');
        if (!link) {
          log('🖼️ Image Preview: No link found');
          return;
        }
        
        log('🖼️ Image Preview: Link found:', link);
        
        const img = link.querySelector('img');
        if (!img) {
          log('🖼️ Image Preview: No image in link');
          return;
        }
        
        log('🖼️ Image Preview: Image found:', img);
        
        const href = link.getAttribute('href');
        log('🖼️ Image Preview: Link URL:', href);
        
        if (!href || !isImageFile(href)) {
          log('🖼️ Image Preview: Not an image or no href');
          return;
        }
        
        log('🖼️ Image Preview: This is an image!');
        
        const target = link.getAttribute('target');
        log('🖼️ Image Preview: Link target:', target);
        
        if (target === '_blank') {
          log('🖼️ Image Preview: Intercepting click and showing modal window');
          e.preventDefault();
          
          showModal(href, img.alt);
        } else {
          log('🖼️ Image Preview: Target not _blank, skipping');
        }
      });
      
      // Modal window close handlers
      modal.addEventListener('click', function(e) {
        if (e.target === modal || e.target.classList.contains('modal-close')) {
          hideModal();
        }
      });
      
      // Close on Escape
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
          hideModal();
        }
      });

      log('🖼️ Image Preview: Initialization completed');
    };

    // Start initialization
    initImagePreview();

    return () => {
      if (enableLogs) {
        console.log('🖼️ Image Preview: Component unmounted');
      }
    };
  }, []);

  return null; // This component doesn't render anything visible
};

export default ImagePreview;

