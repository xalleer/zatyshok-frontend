export const useAuthLayout = () => {
  const customBack = useState<(() => void) | null>('auth-layout-back', () => null)

  return { customBack }
}
