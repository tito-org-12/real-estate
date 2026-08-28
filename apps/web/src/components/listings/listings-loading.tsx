export function ListingsLoading() {
  return (
    <div className='min-h-screen bg-background'>
      <div className='grid min-h-screen grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)_440px]'>
        <div className='hidden border-r border-border/60 bg-[#f7f7f8] lg:block' />
        <div className='border-r border-border/60 p-6'>
          <div className='mb-6 h-10 w-48 animate-pulse rounded-full bg-muted' />
          <div className='space-y-4'>
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className='h-28 animate-pulse rounded-2xl bg-muted'
              />
            ))}
          </div>
        </div>
        <div className='hidden p-6 xl:block'>
          <div className='h-140 animate-pulse rounded-3xl bg-muted' />
        </div>
      </div>
    </div>
  );
}
