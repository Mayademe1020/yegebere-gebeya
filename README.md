# Yegebere Gebeya (የገበሬ ገበያ) - Ethiopian Livestock Platform

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791)](https://www.postgresql.org/)
[![PWA](https://img.shields.io/badge/PWA-Enabled-green)](https://web.dev/progressive-web-apps/)

## 🎯 Project Overview

Yegebere Gebeya is Ethiopia's premier digital livestock platform, designed to transform the traditional livestock market through trust-building, transparency, and community-driven knowledge sharing. The platform serves Ethiopian farmers with culturally-sensitive tools for animal management, marketplace access, and veterinary consultation.

## ✨ Key Features

### 🏠 Digital Barn (የኔ እርባታ)
- **Animal Registration**: Unique ID system with photo management
- **Milk Production Logging**: Daily tracking with Ethiopian calendar
- **Health Record Keeping**: Vaccination and treatment tracking with reminders
- **Ethiopian Localization**: Full Amharic interface with cultural sensitivity

### 🛒 Marketplace (ገበያ)
- **Multi-tiered Verification**: Free, Video Verified, and Vet-Inspected listings
- **Advanced Filtering**: By animal type, location, price, and verification status
- **Trust Building**: Transparent seller information and verification badges
- **Mobile-Optimized**: Touch-friendly interface for smartphone users

### 📚 Knowledge Hub (ምክር)
- **Daily Tips**: Practical livestock management advice
- **Q&A Forum**: Community-driven knowledge sharing with verified vet responses
- **Expert Library**: Curated video guides for best practices
- **Multi-modal Input**: Text, voice, photo, and video question posting

### 🔐 Authentication & Security
- **Phone-based OTP**: SMS and Telegram dual-channel delivery
- **Ethiopian Phone Validation**: Supports all Ethiopian mobile formats
- **Secure Sessions**: JWT-based authentication with proper security measures
- **Privacy Protection**: User data encryption and secure communication

## 🏗️ Technical Architecture

### Frontend Stack
- **Next.js 14**: React framework with App Router and server-side rendering
- **TypeScript**: Type-safe development with comprehensive type definitions
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Radix UI**: Accessible component library with shadcn/ui integration
- **PWA**: Progressive Web App capabilities for offline functionality

### Backend Stack
- **Node.js**: Serverless functions for API endpoints
- **PostgreSQL**: Robust relational database with Prisma ORM
- **Prisma**: Type-safe database client with migration management
- **JWT**: Secure authentication token management

### External Integrations
- **Cloudinary**: Image and video processing with CDN delivery
- **Twilio**: SMS delivery for OTP authentication
- **Telegram Bot API**: Alternative OTP delivery and communication
- **Ethiopian Calendar**: Custom implementation for date handling

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/bun
- PostgreSQL database (local or cloud)
- Cloudinary account for media storage
- SMS service (Twilio or Ethiopian provider)
- Telegram Bot API access (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mayademe1020/yegebere-gebeya.git
   cd yegebere-gebeya
   ```

2. **Install dependencies**
   ```bash
   bun install
   # or npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following variables:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/yegebere_gebeya"
   
   # Authentication
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   
   # SMS Service (Twilio)
   TWILIO_ACCOUNT_SID="your-twilio-sid"
   TWILIO_AUTH_TOKEN="your-twilio-token"
   TWILIO_PHONE_NUMBER="your-twilio-number"
   
   # Telegram Bot (Optional)
   TELEGRAM_BOT_TOKEN="your-bot-token"
   
   # Media Storage
   CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"
   ```

4. **Set up the database**
   ```bash
   # Create database
   createdb yegebere_gebeya
   
   # Run migrations
   bunx prisma migrate dev
   
   # Seed database (optional)
   bunx prisma db seed
   ```

5. **Start the development server**
   ```bash
   bun dev
   # or npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Mobile Experience

The platform is designed mobile-first with:
- **Touch-friendly interfaces** with minimum 44px tap targets
- **Responsive design** that works on all screen sizes
- **PWA capabilities** for app-like experience
- **Offline functionality** for core features
- **Fast loading** optimized for 3G networks

## 🌍 Localization

### Supported Languages
- **Amharic (አማርኛ)**: Primary interface language
- **Afaan Oromo**: Secondary language support
- **English**: International language option

### Cultural Features
- **Ethiopian Calendar**: All dates use Ethiopian calendar system
- **Local Currency**: Ethiopian Birr (ETB) formatting
- **Cultural Sensitivity**: Respectful communication patterns
- **Traditional Integration**: Complements existing farming practices

## 🔒 Security & Privacy

### Data Protection
- **Encryption**: All sensitive data encrypted at rest and in transit
- **Phone Privacy**: In-app messaging prevents phone number exposure
- **Secure Authentication**: OTP-based login with rate limiting
- **Data Minimization**: Only necessary data collection

### Privacy Features
- **Anonymous Browsing**: Browse listings without registration
- **Controlled Communication**: In-app messaging for privacy
- **Data Control**: Users control their information sharing
- **Transparent Policies**: Clear privacy and terms of service

## 📊 Database Schema

### Core Entities
- **Users**: Phone-based authentication with profile information
- **Animals**: Comprehensive livestock records with health tracking
- **Listings**: Marketplace entries with verification tiers
- **Messages**: In-app communication system
- **Questions**: Knowledge hub Q&A forum
- **Veterinarians**: Professional service provider profiles

### Key Relationships
- Users can own multiple animals and create multiple listings
- Animals can be listed in marketplace with verification status
- Messages connect buyers and sellers for specific listings
- Questions can receive answers from community and verified vets

## 🧪 Testing

### Test Coverage
- **Unit Tests**: Core business logic and utilities
- **Integration Tests**: API endpoints and database operations
- **E2E Tests**: Critical user flows and authentication
- **Accessibility Tests**: WCAG compliance and screen reader support

### Running Tests
```bash
# Unit tests
bun test

# E2E tests
bun test:e2e

# Accessibility tests
bun test:a11y
```

## 🚀 Deployment

### Production Setup
1. **Environment Configuration**: Set production environment variables
2. **Database Migration**: Run production migrations
3. **Build Optimization**: Generate optimized production build
4. **CDN Setup**: Configure Cloudinary for media delivery
5. **Monitoring**: Set up error tracking and performance monitoring

### Deployment Commands
```bash
# Build for production
bun build

# Start production server
bun start

# Database migration
bunx prisma migrate deploy
```

## 📈 Performance Optimization

### Core Web Vitals
- **LCP**: < 2.5s through image optimization and SSR
- **FID**: < 100ms with efficient JavaScript loading
- **CLS**: < 0.1 through proper layout design

### Optimization Strategies
- **Image Optimization**: WebP format with lazy loading
- **Code Splitting**: Route-based and component-based splitting
- **Caching**: Aggressive caching for static assets
- **Compression**: Gzip/Brotli compression for all assets

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Airbnb configuration with custom rules
- **Prettier**: Consistent code formatting
- **Conventional Commits**: Structured commit messages

## 📋 Roadmap

### Phase 1 (MVP) ✅ Complete
- Core animal management features
- Basic marketplace with verification
- Knowledge hub with Q&A forum
- Phone-based authentication
- Ethiopian localization

### Phase 2 (Months 3-6)
- In-app messaging system
- Video upload for listings
- Enhanced vet consultation booking
- Advanced analytics dashboard
- Mobile app development

### Phase 3 (Long-term)
- Financial services integration
- AI-powered diagnostics
- Supply chain integration
- Geographic expansion

## 📞 Support

### Documentation
- **API Documentation**: Available at `/api/docs`
- **User Guide**: Comprehensive user manual
- **Developer Guide**: Technical implementation details

### Community
- **GitHub Issues**: Bug reports and feature requests
- **Discussions**: Community questions and ideas
- **Wiki**: Additional documentation and guides

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Ethiopian Farmers**: For inspiring this platform and providing valuable feedback
- **Animall.in & Pashushala.com**: For system design inspiration
- **Open Source Community**: For the amazing tools and libraries used
- **Beta Testers**: For early feedback and testing

---

**Built with ❤️ for Ethiopian farmers**

*Transforming traditional livestock markets through technology while respecting cultural values and traditional practices.*
