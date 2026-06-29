<template>
  <main class="page-shell">
    <section class="story-banner">
      <div class="story-copy">
        <p class="section-label section-label--soft">Our Story</p>
        <h1>From products on a shelf to a smoother shopping experience online.</h1>
        <p class="lead">
          MyShop was built to make ecommerce feel more personal, more helpful, and much easier to
          enjoy. We curate products with care, keep the browsing experience simple, and make it easy
          for customers to move from discovery to checkout without friction.
        </p>
        <div class="story-actions">
          <router-link to="/products" class="cta-btn cta-btn--solid">Shop Our Products</router-link>
          <router-link to="/contact" class="cta-btn cta-btn--ghost">Get in Touch</router-link>
        </div>
      </div>

      <div class="story-visual" aria-hidden="true">
        <img
          class="story-image"
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80"
          alt="Customers browsing products in a modern retail store"
        />
        <div class="story-image-badge">
          <strong>Fresh finds</strong>
          <span>Curated products delivered with care</span>
        </div>
      </div>
    </section>

    <section class="promise-card">
      <div>
        <p class="section-label">Customer promise</p>
        <h2>Shopping you can feel good about</h2>
      </div>
      <div class="promise-grid">
        <div class="promise-item">
          <strong>Secure checkout</strong>
          <span>Safe payment flow designed to reduce friction.</span>
        </div>
        <div class="promise-item">
          <strong>Saved favorites</strong>
          <span>Wishlist items stay easy to revisit when you're ready.</span>
        </div>
        <div class="promise-item">
          <strong>Fast support</strong>
          <span>Helpful contact options if you need a quick answer.</span>
        </div>
      </div>
    </section>

    <section class="testimonials-card">
      <div class="section-head-center">
        <p class="section-label section-label--center">Customer Love</p>
        <h2>What our customers say</h2>
        <p>Real reviews from shoppers who love browsing and buying with MyShop.</p>
      </div>

      <div class="testimonial-grid">
        <article class="testimonial-card">
          <div class="stars">★★★★★</div>
          <p>
            "The product selection is easy to browse and the checkout feels quick. I can save items
            in my wishlist and come back later without losing track."
          </p>
          <div class="testimonial-user">
            <div class="user-avatar">S</div>
            <div>
              <strong>Srey Mom</strong>
              <span>Phnom Penh</span>
            </div>
          </div>
        </article>

        <article class="testimonial-card">
          <div class="stars">★★★★★</div>
          <p>
            "Everything feels organized, from product details to cart management. It looks and feels
            like a real modern ecommerce store."
          </p>
          <div class="testimonial-user">
            <div class="user-avatar">D</div>
            <div>
              <strong>David Chen</strong>
              <span>Siem Reap</span>
            </div>
          </div>
        </article>

        <article class="testimonial-card">
          <div class="stars">★★★★★</div>
          <p>
            "I can find what I need fast, compare options easily, and shop with confidence. That
            makes a big difference."
          </p>
          <div class="testimonial-user">
            <div class="user-avatar">L</div>
            <div>
              <strong>Linda Mok</strong>
              <span>Battambang</span>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="values-card">
      <div class="section-head-center">
        <p class="section-label section-label--center">What we stand for</p>
        <h2>Our core values</h2>
        <p>These principles guide every decision we make and every product we feature.</p>
      </div>

      <div class="values-grid">
        <article class="value-item">
          <div class="value-icon">◫</div>
          <h3>Quality First</h3>
          <p>We focus on products that feel useful, reliable, and worth adding to your cart.</p>
        </article>

        <article class="value-item">
          <div class="value-icon">♡</div>
          <h3>Customer Care</h3>
          <p>We keep the experience friendly with simple navigation and helpful support.</p>
        </article>

        <article class="value-item">
          <div class="value-icon">▭</div>
          <h3>Transparency</h3>
          <p>Clear product details and straightforward checkout help people shop with confidence.</p>
        </article>

        <article class="value-item">
          <div class="value-icon">↗</div>
          <h3>Fresh Selection</h3>
          <p>We keep the catalog updated so customers always have something new to explore.</p>
        </article>
      </div>
    </section>
  </main>
</template>

<style scoped>
.page-shell {
  max-width: 1120px;
  margin: 0 auto;
  padding: 56px 20px 72px;
}

.story-banner {
  margin-top: 22px;
  padding: 32px;
  border-radius: 28px;
  background:
    radial-gradient(circle at 75% 20%, rgba(255, 255, 255, 0.1), transparent 28%),
    linear-gradient(135deg, #ff7a15 0%, #ff9c4a 100%);
  box-shadow: 0 18px 50px rgba(18, 32, 51, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 24px;
  overflow: hidden;
}

.story-copy {
  color: #effffc;
}

.section-label {
  margin: 0 0 10px;
  color: #ff7a15;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.section-label--soft {
  color: #ffffff;
  background: rgba(255, 122, 21, 0.18);
  width: fit-content;
  padding: 6px 12px;
  border-radius: 999px;
  margin-bottom: 14px;
}

.story-copy h1 {
  margin: 0;
  color: #ffffff;
  font-size: clamp(2rem, 4vw, 3.15rem);
  line-height: 1.05;
  max-width: 620px;
}

.lead {
  margin: 18px 0 0;
  max-width: 620px;
  color: rgba(239, 255, 252, 0.9);
  line-height: 1.8;
  font-size: 1.02rem;
}

.story-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 26px;
}

.story-visual {
  position: relative;
  min-height: 260px;
  border-radius: 24px;
  overflow: hidden;
}

.story-image {
  width: 100%;
  height: 100%;
  min-height: 260px;
  object-fit: cover;
  border-radius: 24px;
  display: block;
  opacity: 0.96;
}

.story-image-badge {
  position: absolute;
  left: 18px;
  bottom: 18px;
  max-width: 220px;
  padding: 14px 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.86);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 122, 21, 0.14);
  box-shadow: 0 14px 24px rgba(18, 32, 51, 0.12);
}

.story-image-badge strong {
  display: block;
  color: #16243c;
  font-size: 0.98rem;
  margin-bottom: 4px;
}

.story-image-badge span {
  display: block;
  color: #5f6d82;
  font-size: 0.88rem;
  line-height: 1.5;
}

.promise-card {
  margin-top: 22px;
  padding: 28px;
  border-radius: 24px;
  background: #fff;
  border: 1px solid rgba(255, 122, 21, 0.12);
  box-shadow: 0 12px 28px rgba(18, 32, 51, 0.06);
}

.promise-card h2 {
  margin: 0;
  color: #16243c;
  font-size: 1.5rem;
  line-height: 1.2;
}

.promise-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: 18px;
}

.promise-item {
  padding: 18px;
  border-radius: 18px;
  background: #fff8f1;
  border: 1px solid rgba(255, 122, 21, 0.08);
}

.promise-item strong {
  display: block;
  color: #16243c;
  font-size: 0.98rem;
  margin-bottom: 6px;
}

.promise-item span {
  color: #5f6d82;
  line-height: 1.65;
}

.testimonials-card,
.values-card {
  margin-top: 22px;
  padding: 32px;
  border-radius: 28px;
  background: linear-gradient(180deg, #fff8f1 0%, #fff3e8 100%);
  border: 1px solid rgba(255, 122, 21, 0.12);
  box-shadow: 0 18px 50px rgba(18, 32, 51, 0.08);
}

.section-head-center {
  text-align: center;
  max-width: 760px;
  margin: 0 auto;
}

.section-head-center h2 {
  margin: 0;
  color: #16243c;
  font-size: clamp(1.8rem, 3vw, 2.7rem);
  line-height: 1.15;
}

.section-head-center p {
  margin: 10px 0 0;
  color: #5f6d82;
}

.section-label--center {
  margin-left: auto;
  margin-right: auto;
}

.testimonial-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  margin-top: 32px;
}

.testimonial-card {
  padding: 24px;
  background: #fff;
  border-radius: 22px;
  border: 1px solid rgba(255, 122, 21, 0.1);
  box-shadow: 0 12px 28px rgba(18, 32, 51, 0.06);
}

.stars {
  color: #f4a000;
  font-size: 1.05rem;
  letter-spacing: 1px;
  margin-bottom: 18px;
}

.testimonial-card p {
  margin: 0;
  color: #5f6d82;
  line-height: 1.75;
  font-style: italic;
}

.testimonial-user {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 22px;
}

.user-avatar {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff7a15 0%, #ff9c4a 100%);
  color: #fff;
  font-weight: 800;
}

.testimonial-user strong {
  display: block;
  color: #16243c;
}

.testimonial-user span {
  display: block;
  color: #7b8798;
  font-size: 0.92rem;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
  margin-top: 32px;
}

.value-item {
  text-align: center;
}

.value-icon {
  width: 52px;
  height: 52px;
  margin: 0 auto 16px;
  display: grid;
  place-items: center;
  border-radius: 16px;
  background: rgba(255, 122, 21, 0.12);
  color: #ff7a15;
  font-size: 1.2rem;
  font-weight: 800;
}

.value-item h3 {
  margin: 0 0 10px;
  color: #16243c;
  font-size: 1.05rem;
}

.value-item p {
  margin: 0;
  color: #5f6d82;
  line-height: 1.7;
}

.cta-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  padding: 0 18px;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 700;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    background 0.18s ease,
    color 0.18s ease;
}

.cta-btn:hover {
  transform: translateY(-1px);
}

.cta-btn--solid {
  color: #fff;
  background: linear-gradient(90deg, #ff7a15 0%, #ff9c4a 100%);
  box-shadow: 0 10px 20px rgba(255, 122, 21, 0.22);
}

.cta-btn--solid:hover {
  box-shadow: 0 14px 26px rgba(255, 122, 21, 0.28);
}

.cta-btn--ghost {
  color: #ff7a15;
  background: rgba(255, 122, 21, 0.06);
  border: 1px solid rgba(255, 122, 21, 0.18);
}

.cta-btn--ghost:hover {
  background: rgba(255, 122, 21, 0.1);
}

@media (max-width: 900px) {
    .story-banner {
    grid-template-columns: 1fr;
    padding: 24px;
  }

  .promise-grid,
  .testimonial-grid,
  .values-grid {
    grid-template-columns: 1fr;
  }

  .story-visual,
  .story-image {
    min-height: 180px;
  }
}
</style>
