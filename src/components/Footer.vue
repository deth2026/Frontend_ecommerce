<template>
  <footer class="footer">
    <div class="footer-shell">
      <div class="footer-top">
        <div class="brand-block">
          <div class="footer-logo">Glowrose</div>
          <p class="footer-desc">
            Your favorite place to shop online. We bring the best products right to your doorstep
            with love and care.
          </p>

          <div class="social-links">
            <a href="https://facebook.com" target="_blank" class="social-icon" aria-label="Facebook">
              <span>f</span>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              class="social-icon"
              aria-label="Instagram"
            >
              <span>ig</span>
            </a>
            <a href="https://twitter.com" target="_blank" class="social-icon" aria-label="Twitter">
              <span>x</span>
            </a>
            <a href="https://tiktok.com" target="_blank" class="social-icon" aria-label="TikTok">
              <span>tt</span>
            </a>
          </div>
        </div>

        <div class="footer-grid">
          <div class="footer-section">
            <h4>Shop</h4>
            <router-link to="/products" class="footer-link">All Products</router-link>
            <router-link to="/cart" class="footer-link">Cart</router-link>
            <router-link to="/wishlist" class="footer-link">Wishlist</router-link>
            <router-link to="/orders" class="footer-link">My Orders</router-link>
          </div>

          <div class="footer-section">
            <h4>Account</h4>
            <router-link to="/login" class="footer-link">Login</router-link>
            <router-link to="/register" class="footer-link">Register</router-link>
            <router-link to="/profile" class="footer-link">Profile</router-link>
          </div>

          <div class="footer-section">
            <h4>Contact</h4>
            <p class="footer-contact">Phnom Penh, Cambodia</p>
            <p class="footer-contact">+855 12 345 678</p>
            <p class="footer-contact">hello@myshop.com</p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  width: 100vw;
  margin-left: calc(50% - 50vw);
  padding: 34px 20px 24px;
  margin-top: auto;
  background:
    radial-gradient(circle at top left, rgba(255, 122, 21, 0.14), transparent 30%),
    radial-gradient(circle at top right, rgba(255, 159, 90, 0.11), transparent 28%),
    linear-gradient(180deg, #fffaf5 0%, #fff3e8 100%);
  border-top: 1px solid rgba(255, 122, 21, 0.1);
}

.footer-shell {
  width: min(100%, 1400px);
  margin: 0 auto;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.82), rgba(255, 251, 247, 0.92));
  border: 1px solid rgba(255, 122, 21, 0.14);
  border-radius: 32px;
  box-shadow:
    0 22px 60px rgba(18, 32, 51, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
  padding: 32px;
  backdrop-filter: blur(14px);
}

.footer-top {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 32px;
  align-items: start;
}

.brand-block {
  display: grid;
  gap: 14px;
  padding-right: 8px;
}

.footer-logo {
  font-size: 1.8rem;
  font-weight: 800;
  color: #16243c;
  letter-spacing: -0.03em;
  width: fit-content;
  padding: 4px 0;
  position: relative;
}

.footer-desc {
  margin: 0;
  color: #627085;
  line-height: 1.7;
  max-width: 390px;
  font-size: 0.98rem;
}

.social-links {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.social-icon {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: linear-gradient(180deg, #ffffff, #fff3e8);
  border: 1px solid rgba(255, 122, 21, 0.16);
  color: #ff7a15;
  text-decoration: none;
  font-weight: 800;
  text-transform: uppercase;
  box-shadow: 0 10px 20px rgba(18, 32, 51, 0.06);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    background 0.18s ease,
    border-color 0.18s ease;
}

.social-icon:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 24px rgba(255, 122, 21, 0.2);
  background: linear-gradient(180deg, #fff7f1, #ffe7d6);
  border-color: rgba(255, 122, 21, 0.28);
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.footer-section {
  display: grid;
  gap: 10px;
  padding: 18px;
  border-radius: 24px;
  background:
    linear-gradient(180deg, rgba(255, 248, 241, 0.92), rgba(255, 255, 255, 0.88));
  border: 1px solid rgba(255, 122, 21, 0.08);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.75);
}

.footer-section h4 {
  margin: 0 0 4px;
  font-size: 0.98rem;
  font-weight: 800;
  color: #16243c;
  letter-spacing: 0.01em;
  position: relative;
  padding-bottom: 8px;
}

.footer-section h4::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 34px;
  height: 2px;
  border-radius: 999px;
  background: linear-gradient(90deg, #ff7a15 0%, #ff9c4a 100%);
}

.footer-link {
  color: #627085;
  text-decoration: none;
  font-size: 0.94rem;
  font-weight: 600;
  transition:
    color 0.18s ease,
    transform 0.18s ease,
    background-color 0.18s ease;
  width: fit-content;
  padding: 4px 0;
}

.footer-link:hover {
  color: #ff7a15;
  transform: translateX(5px);
}

.footer-contact {
  margin: 0;
  color: #627085;
  font-size: 0.94rem;
  line-height: 1.7;
}

.footer-bottom {
  margin-top: 24px;
  padding-top: 18px;
  border-top: 1px solid rgba(255, 122, 21, 0.14);
  text-align: center;
  color: #7b8798;
  font-size: 0.9rem;
}

.footer-bottom p {
  margin: 0;
}

@media (max-width: 900px) {
  .footer-top {
    grid-template-columns: 1fr;
  }

  .footer-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 640px) {
  .footer {
    padding: 16px;
    width: 100%;
    margin-left: 0;
  }

  .footer-shell {
    padding: 20px;
    border-radius: 24px;
  }

  .footer-grid {
    grid-template-columns: 1fr;
  }
}
</style>
