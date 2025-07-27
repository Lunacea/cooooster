'use client'

interface LoadingSpinnerProps {
  title: string
  subtitle?: string
  size?: 'sm' | 'md' | 'lg'
}

export function LoadingSpinner({ title, subtitle, size = 'md' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-24 h-24'
  };

  const spinnerSize = {
    sm: 64,
    md: 80,
    lg: 96
  };

  return (
    <div className="w-full h-full flex items-center justify-center animate-in fade-in duration-500">
      <div className="text-center animate-in slide-in-from-bottom-4 duration-700 delay-200">
        <div className="relative">
          <div className={`${sizeClasses[size]} mx-auto mb-4`}>
            <svg className="w-full h-full animate-spin" viewBox={`0 0 ${spinnerSize[size]} ${spinnerSize[size]}`}>
              <g transform={`translate(${spinnerSize[size] / 2}, ${spinnerSize[size] / 2})`}>
                <polygon points="0,-20 17,10 -17,10" fill="#0071b0" opacity="0.8" transform="rotate(0)" />
                <polygon points="0,-20 17,10 -17,10" fill="#ff8811" opacity="0.6" transform="rotate(120)" />
                <polygon points="0,-20 17,10 -17,10" fill="#f4d06f" opacity="0.4" transform="rotate(240)" />
              </g>
            </svg>
          </div>
        </div>
        <p className="text-gray-600 animate-in fade-in duration-500 delay-300">{title}</p>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-2 animate-in fade-in duration-500 delay-400">{subtitle}</p>
        )}
      </div>
    </div>
  );
} 