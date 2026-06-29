<script setup lang="ts">
import { reactive, ref } from 'vue'
import { sendContact } from '@/services/contact'

const form = reactive({
  name: '',
  email: '',
  subject: 'General question',
  message: '',
})

const submitted = ref(false)
const submitError = ref('')
const isSubmitting = ref(false)

const resetForm = () => {
  form.name = ''
  form.email = ''
  form.subject = 'General question'
  form.message = ''
}

const handleSubmit = async () => {
  isSubmitting.value = true
  submitted.value = false
  submitError.value = ''

  try {
    await sendContact({
      name: form.name,
      email: form.email,
      subject: form.subject,
      message: form.message,
    })

    submitted.value = true
    resetForm()
  } catch (err: any) {
    const message = err?.response?.data?.message || err?.message || 'Something went wrong. Please try again.'
    submitError.value = message
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <main class="contact-page">
    <section class="support-grid">
      <article class="support-card">
        <div class="support-icon">✉</div>
        <div>
          <p>Email</p>
          <strong>hello@myshop.com</strong>
        </div>
      </article>

      <article class="support-card">
        <div class="support-icon">☎</div>
        <div>
          <p>Phone</p>
          <strong>+855 12 345 678</strong>
        </div>
      </article>

      <article class="support-card">
        <div class="support-icon">⌂</div>
        <div>
          <p>Location</p>
          <strong>Phnom Penh, Cambodia</strong>
        </div>
      </article>

      <article class="support-card">
        <div class="support-icon">⏱</div>
        <div>
          <p>Hours</p>
          <strong>Mon - Sat, 8:00 - 18:00</strong>
        </div>
      </article>
    </section>

    <section class="contact-layout">
      <form class="contact-form" @submit.prevent="handleSubmit">
        <div class="form-head">
          <p class="eyebrow eyebrow--small">Send a message</p>
          <h2>Tell us what you need and we will take care of the rest.</h2>
          <p>
          Fill out the form below and tell us what you need help with. We’ll get back to you as
          soon as possible.
          </p>
        </div>

        <div class="field-grid">
          <label class="field">
            <span>Full name</span>
            <input v-model="form.name" type="text" placeholder="Your name" required />
          </label>

          <label class="field">
            <span>Email address</span>
            <input v-model="form.email" type="email" placeholder="you@example.com" required />
          </label>

          <label class="field">
            <span>Subject</span>
            <select v-model="form.subject">
              <option>General question</option>
              <option>Order support</option>
              <option>Shipping and delivery</option>
              <option>Product information</option>
              <option>Return or refund</option>
            </select>
          </label>

          <label class="field field--full">
            <span>Message</span>
            <textarea
              v-model="form.message"
              rows="6"
              placeholder="Tell us how we can help"
              required
            />
          </label>
        </div>

        <div class="form-footer">
          <button type="submit" class="submit-btn" :disabled="isSubmitting">
            {{ isSubmitting ? 'Sending...' : 'Send Message' }}
          </button>
          <p class="form-note">
            By sending this message, you agree to share your contact details so we can reply.
          </p>
        </div>

        <p v-if="submitError" class="error-message">
          {{ submitError }}
        </p>
        <p v-if="submitted" class="success-message">
          Thanks for reaching out. Our team will get back to you shortly.
        </p>
      </form>

      <aside class="info-sidebar">
        <div class="sidebar-card">
          <p class="section-label">How we help</p>
          <h2>Common support requests</h2>
          <ul class="help-list">
            <li>Questions about product details or stock</li>
            <li>Order tracking and delivery updates</li>
            <li>Returns, refunds, and exchange help</li>
            <li>Account and checkout support</li>
          </ul>
        </div>

        <div class="sidebar-card sidebar-card--accent">
          <p class="section-label section-label--light">Why contact us</p>
          <h3>We keep support simple and fast.</h3>
          <p>
            Our goal is to make sure every customer feels taken care of from the moment they browse
            to the moment they receive their order.
          </p>
        </div>
      </aside>
    </section>
  </main>
</template>

<style scoped>
.contact-page {
  max-width: 1280px;
  margin: 0 auto;
  padding: 56px 20px 80px;
  background:
    radial-gradient(circle at top left, rgba(255, 122, 21, 0.08), transparent 28%),
    radial-gradient(circle at top right, rgba(255, 159, 74, 0.08), transparent 24%),
    linear-gradient(180deg, #fffdfb 0%, #fffaf5 100%);
}

.contact-hero {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 22px;
  align-items: stretch;
}

.hero-copy,
.hero-panel,
.support-card,
.contact-form,
.sidebar-card {
  border-radius: 28px;
  border: 1px solid rgba(255, 122, 21, 0.14);
  box-shadow: 0 18px 50px rgba(18, 32, 51, 0.08);
  backdrop-filter: blur(12px);
}

.hero-copy {
  padding: 48px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.9), rgba(255, 248, 241, 0.96)),
    linear-gradient(135deg, #fff8f1 0%, #ffffff 100%);
}

.eyebrow {
  margin: 0 0 12px;
  color: #ff7a15;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.78rem;
}

.eyebrow--small {
  margin-bottom: 10px;
}

.hero-copy h1 {
  margin: 0;
  color: #16243c;
  font-size: clamp(2.2rem, 4vw, 3.8rem);
  line-height: 1.05;
  letter-spacing: -0.04em;
}

.lead {
  margin: 18px 0 0;
  max-width: 760px;
  color: #5f6d82;
  font-size: 1.05rem;
  line-height: 1.75;
}

.hero-pills {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: 32px;
}

.hero-pill {
  padding: 18px 16px;
  border-radius: 20px;
  background: linear-gradient(180deg, #fff 0%, #fff8f1 100%);
  border: 1px solid rgba(255, 122, 21, 0.12);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.85);
}

.hero-pill strong {
  display: block;
  color: #ff7a15;
  font-size: 1.1rem;
}

.hero-pill span {
  display: block;
  margin-top: 6px;
  color: #5f6d82;
  line-height: 1.6;
}

.hero-panel {
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at 70% 20%, rgba(255, 255, 255, 0.16), transparent 26%),
    linear-gradient(135deg, #ff7a15 0%, #ff9c4a 100%);
  min-height: 340px;
  padding: 26px;
  isolation: isolate;
}

.hero-panel::before,
.hero-panel::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  filter: blur(4px);
}

.hero-panel::before {
  width: 160px;
  height: 160px;
  top: -40px;
  right: -28px;
}

.hero-panel::after {
  width: 220px;
  height: 220px;
  left: -90px;
  bottom: -110px;
}

.hero-panel__badge {
  display: inline-flex;
  align-items: center;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
  font-size: 0.84rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hero-panel__card {
  position: absolute;
  max-width: 240px;
  padding: 18px 18px 16px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.94);
  color: #16243c;
  box-shadow: 0 18px 28px rgba(18, 32, 51, 0.16);
}

.hero-panel__card strong {
  display: block;
  font-size: 1rem;
  margin-bottom: 8px;
}

.hero-panel__card span {
  color: #5f6d82;
  line-height: 1.6;
}

.hero-panel__card--top {
  top: 86px;
  right: 24px;
}

.hero-panel__card--bottom {
  left: 24px;
  bottom: 24px;
}

.support-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-top: 24px;
}

.support-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 22px 20px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(255, 248, 241, 0.95));
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.support-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 22px 34px rgba(18, 32, 51, 0.12);
}

.support-icon {
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  border-radius: 16px;
  background: rgba(255, 122, 21, 0.12);
  color: #ff7a15;
  font-size: 1.15rem;
  font-weight: 800;
  flex: 0 0 52px;
}

.support-card p {
  margin: 0 0 4px;
  color: #7b8798;
  font-size: 0.88rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.support-card strong {
  color: #16243c;
  font-size: 1rem;
  line-height: 1.5;
}

.contact-layout {
  display: grid;
  grid-template-columns: 1.3fr 0.7fr;
  gap: 22px;
  margin-top: 24px;
}

.contact-form {
  padding: 34px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(255, 248, 241, 0.95));
  position: relative;
  overflow: hidden;
}

.contact-form::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(circle at top right, rgba(255, 122, 21, 0.08), transparent 30%);
}

.form-head h2,
.sidebar-card h2,
.sidebar-card h3 {
  margin: 0;
  color: #16243c;
}

.form-head h2 {
  font-size: clamp(1.6rem, 2.6vw, 2.4rem);
  line-height: 1.12;
  letter-spacing: -0.03em;
}

.form-head p {
  margin: 12px 0 0;
  color: #5f6d82;
  line-height: 1.7;
}

.field-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-top: 26px;
}

.field {
  display: grid;
  gap: 8px;
}

.field--full {
  grid-column: 1 / -1;
}

.field span {
  color: #16243c;
  font-weight: 700;
  font-size: 0.95rem;
}

.field input,
.field select,
.field textarea {
  width: 100%;
  border-radius: 18px;
  border: 1px solid rgba(255, 122, 21, 0.14);
  background: #fff;
  color: #16243c;
  padding: 14px 16px;
  font: inherit;
  transition: border-color 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
}

.field textarea {
  resize: vertical;
  min-height: 160px;
}

.field input:focus,
.field select:focus,
.field textarea:focus {
  outline: none;
  border-color: rgba(255, 122, 21, 0.4);
  box-shadow: 0 0 0 4px rgba(255, 122, 21, 0.12);
  background: #fffdfb;
}

.form-footer {
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 24px;
}

.submit-btn {
  min-height: 48px;
  padding: 0 22px;
  border: 0;
  border-radius: 999px;
  background: linear-gradient(90deg, #ff7a15 0%, #ff9c4a 100%);
  color: #fff;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(255, 122, 21, 0.22);
  transition: transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 14px 26px rgba(255, 122, 21, 0.28);
}

.submit-btn:disabled {
  cursor: progress;
  opacity: 0.8;
}

.form-note {
  margin: 0;
  max-width: 420px;
  color: #7b8798;
  line-height: 1.65;
  font-size: 0.92rem;
}

.success-message {
  margin: 18px 0 0;
  color: #ff7a15;
  font-weight: 700;
}

.error-message {
  margin: 18px 0 0;
  color: #d32f2f;
  font-weight: 700;
  background: rgba(211, 47, 47, 0.08);
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid rgba(211, 47, 47, 0.2);
}

.info-sidebar {
  display: grid;
  gap: 18px;
}

.sidebar-card {
  padding: 28px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(255, 248, 241, 0.96));
}

.section-label {
  margin: 0 0 10px;
  color: #ff7a15;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.section-label--light {
  color: #fff;
}

.help-list {
  margin: 18px 0 0;
  padding-left: 18px;
  color: #5f6d82;
  line-height: 1.75;
}

.sidebar-card--accent {
  background: linear-gradient(135deg, #ff7a15 0%, #ff9c4a 100%);
  color: #fff;
}

.sidebar-card--accent h3 {
  color: #fff;
  font-size: 1.4rem;
  line-height: 1.2;
}

.sidebar-card--accent p {
  margin: 14px 0 0;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.7;
}

.sidebar-card--accent,
.hero-panel {
  position: relative;
}

@media (max-width: 1000px) {
  .contact-hero,
  .contact-layout {
    grid-template-columns: 1fr;
  }

  .support-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .hero-panel {
    min-height: 300px;
  }
}

@media (max-width: 700px) {
  .hero-copy,
  .contact-form,
  .sidebar-card {
    padding: 24px;
  }

  .hero-pills,
  .support-grid,
  .field-grid {
    grid-template-columns: 1fr;
  }

  .hero-panel__card {
    max-width: calc(100% - 48px);
  }

  .hero-panel__card--top {
    top: 74px;
    right: 16px;
  }

  .hero-panel__card--bottom {
    left: 16px;
    bottom: 16px;
  }
}
</style>
