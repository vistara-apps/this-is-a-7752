# GPU Forge

GPU Forge is a web application that allows users to easily discover, rent, and utilize GPUs for AI training, rendering, and other compute-intensive tasks.

## Features

- **GPU Discovery & Selection**: Browse available GPUs, filter by type, specifications, and availability.
- **On-Demand GPU Rental**: Seamlessly rent GPUs for specified durations with immediate provisioning.
- **Pre-configured Environments**: Choose from pre-built Docker images or VM templates with common AI/ML frameworks and rendering software.
- **Session Management & Monitoring**: View active rental sessions, monitor GPU utilization, and track costs in real-time.

## Tech Stack

- **Frontend**: React, Tailwind CSS
- **Authentication**: Privy (email/password and wallet connect)
- **Payments**: Turnkey (blockchain) and Stripe (fiat)
- **Database**: Supabase
- **Blockchain**: Base

## API Integrations

- **GPUNet**: Discover available GPU resources and initiate rental requests
- **Render Network**: Alternative source for GPU resources
- **Turnkey**: Wallet management and blockchain payments
- **Privy**: User authentication and identity management
- **Stripe**: Fiat payment processing

## Architecture

The application follows a modern React architecture with the following structure:

- **API Layer**: Handles communication with external services
- **Context Layer**: Manages global application state
- **Service Layer**: Contains business logic
- **Component Layer**: UI components
- **Utility Layer**: Helper functions and utilities

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/your-org/gpu-forge.git
   cd gpu-forge
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Set up environment variables
   Create a `.env` file in the root directory with the following variables:
   ```
   VITE_GPU_NET_API_KEY=your_gpu_net_api_key
   VITE_RENDER_NETWORK_API_KEY=your_render_network_api_key
   VITE_TURNKEY_API_KEY=your_turnkey_api_key
   VITE_PRIVY_API_KEY=your_privy_api_key
   VITE_BASE_RPC_API_KEY=your_base_rpc_api_key
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_API_KEY=your_supabase_api_key
   VITE_STRIPE_API_KEY=your_stripe_api_key
   ```

4. Start the development server
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── api/                # API integration layer
│   ├── client.ts       # Configured Axios instance
│   ├── config.ts       # API configuration
│   ├── authApi.ts      # Authentication API
│   ├── gpuApi.ts       # GPU-related API
│   ├── environmentApi.ts # Environment-related API
│   ├── paymentApi.ts   # Payment-related API
│   └── index.ts        # API exports
├── components/         # UI components
│   ├── Dashboard.jsx   # Main dashboard
│   ├── GPUCard.jsx     # GPU card component
│   ├── RentButton.jsx  # Rental button component
│   └── ...
├── contexts/           # React contexts
│   ├── AuthContext.tsx # Authentication context
│   ├── GPUContext.tsx  # GPU context
│   ├── EnvironmentContext.tsx # Environment context
│   ├── PaymentContext.tsx # Payment context
│   └── index.ts        # Context exports
├── services/           # Business logic
│   ├── gpuService.ts   # GPU-related services
│   ├── environmentService.ts # Environment-related services
│   ├── paymentService.ts # Payment-related services
│   └── index.ts        # Service exports
├── types/              # TypeScript type definitions
│   └── index.ts        # Type exports
├── utils/              # Utility functions
│   ├── formatters.ts   # Formatting utilities
│   ├── validators.ts   # Validation utilities
│   ├── storage.ts      # Storage utilities
│   └── index.ts        # Utility exports
├── App.jsx             # Main application component
└── main.jsx            # Application entry point
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

