'use client'

import dynamic from 'next/dynamic'
import { useState, useCallback, useEffect } from 'react'
import Menu from '@/shared/components/layouts/Menu'

const DynamicMap = dynamic(
  () => import('@/features/map/Map').then((mod) => ({ default: mod.Map })),
  {
    loading: () => <div className="w-full h-full flex items-center justify-center">地図を読み込み中...</div>,
    ssr: false
  }
)

export function MapWidget() {
  const [isPinButtonDisabled, setIsPinButtonDisabled] = useState(false)
  const [onPinButtonClick, setOnPinButtonClick] = useState<(() => void) | undefined>(undefined)

  // 状態更新を管理するためのフラグ
  const [pendingPinButtonClick, setPendingPinButtonClick] = useState<(() => void) | undefined>(undefined)
  const [pendingPinButtonDisabled, setPendingPinButtonDisabled] = useState<boolean | undefined>(undefined)

  const handlePinButtonClick = useCallback(() => {
    console.log('MapWidget: handlePinButtonClick called, onPinButtonClick:', !!onPinButtonClick);
    if (onPinButtonClick) {
      onPinButtonClick()
    } else {
      console.log('MapWidget: onPinButtonClick is undefined');
    }
  }, [onPinButtonClick])

  // 状態更新をuseEffectで管理
  const handleSetOnPinButtonClick = useCallback((callback: () => void) => {
    console.log('MapWidget: handleSetOnPinButtonClick called');
    setPendingPinButtonClick(() => callback)
  }, [])

  const handleSetIsPinButtonDisabled = useCallback((disabled: boolean) => {
    console.log('MapWidget: handleSetIsPinButtonDisabled called, disabled:', disabled);
    setPendingPinButtonDisabled(disabled)
  }, [])

  // 状態更新を遅延実行
  useEffect(() => {
    if (pendingPinButtonClick !== undefined) {
      console.log('MapWidget: Setting onPinButtonClick state');
      setOnPinButtonClick(() => pendingPinButtonClick)
      setPendingPinButtonClick(undefined)
    }
  }, [pendingPinButtonClick])

  useEffect(() => {
    if (pendingPinButtonDisabled !== undefined) {
      console.log('MapWidget: Setting isPinButtonDisabled state:', pendingPinButtonDisabled);
      setIsPinButtonDisabled(pendingPinButtonDisabled)
      setPendingPinButtonDisabled(undefined)
    }
  }, [pendingPinButtonDisabled])

  return (
    <div className="w-full h-full relative">
      <DynamicMap
        onPinButtonClick={handleSetOnPinButtonClick}
        onPinButtonDisabled={handleSetIsPinButtonDisabled}
      />

      {/* Menuコンポーネントを下部に配置 */}
      <div className="absolute bottom-4 left-4 right-4 z-30">
        <Menu
          onPinButtonClick={handlePinButtonClick}
          isPinButtonDisabled={isPinButtonDisabled}
        />
      </div>
    </div>
  )
}
