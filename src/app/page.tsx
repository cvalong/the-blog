export default function Home() {
  return (
    <main className='bg-[#f3f0e8] dark:bg-[#18251D] flex flex-col justify-start md:grid md:grid-cols-[1fr_640px_1fr]'>
      <article className='space-y-4 py-10 px-6 md:col-start-2'>
        <div className='max-w-prose mx-auto space-y-6'>
          <h1 className='text-2xl font-bold'>Christopher Long:</h1>
          <p>
            <em>Constant Creation</em>. Building from front to back with
            simplicity. Polishing products when necessary.
          </p>
          <p>
            Previously, I built a data reporting platform at{' '}
            <a
              href='https://www.linkedin.com/company/atmoswapsustainability/'
              target='__blank'
              className='underline'
            >
              Atmos.ai
            </a>{' '}
            and built the B2B platform for{' '}
            <a
              href='https://www.oncrux.com/'
              target='__blank'
              className='underline'
            >
              Oncrux
            </a>
          </p>
        </div>

        <div className='max-w-prose mx-auto space-y-6'>
          <h2 className='text-xl font-semibold'>What am I up to:</h2>
          <p>
            Just doing. Experience only comes from the creation, constantly
            building to feed my passions and interests.
          </p>
          <p>
            Pushing my limits through consistent action. It&#39;s how to go from
            0 to 1, or in my case couch to marathon. Climbing, Running, and
            Gamemaster.
          </p>
        </div>

        <div className='max-w-prose mx-auto space-y-6'>
          <h2 className='text-xl font-semibold'>Lets Talk:</h2>
          <p>
            Find me on github{' '}
            <a
              href='https://github.com/cvalong'
              target='__blank'
              className='underline'
            >
              @cvalong
            </a>{' '}
            or{' '}
            <a href='mailto:chris.va.long@gmail.com' className='underline'>
              chris.va.long@gmail.com
            </a>
            .
          </p>
          <p className='text-sm opacity-50'>
            Built with Next.js and Tailwind CSS, deployed with AWS. Text is set
            in the Inter typeface.
          </p>
        </div>
      </article>
    </main>
  );
}
