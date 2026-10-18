import { boardJsonToSvg } from '../../server/services/whiteboardPngRender';

describe('boardJsonToSvg', () => {
  it('returns null for empty or invalid boards', () => {
    expect(boardJsonToSvg(null)).toBeNull();
    expect(boardJsonToSvg('{}')).toBeNull();
    expect(boardJsonToSvg('{not json')).toBeNull();
  });

  it('renders common element types into SVG', () => {
    const svg = boardJsonToSvg(
      JSON.stringify({
        elements: [
          {
            type: 'rectangle',
            x: 10,
            y: 10,
            width: 80,
            height: 40,
            strokeColor: '#111',
            backgroundColor: '#aaf',
            strokeWidth: 2,
          },
          {
            type: 'text',
            x: 10,
            y: 60,
            width: 100,
            height: 30,
            strokeColor: '#111',
            text: 'Hello <board>',
            fontSize: 20,
          },
          {
            type: 'arrow',
            x: 0,
            y: 0,
            strokeColor: '#00f',
            strokeWidth: 2,
            points: [
              [0, 0],
              [40, 20],
            ],
          },
        ],
        appState: { viewBackgroundColor: '#ffffff' },
        files: {},
      })
    );
    expect(svg).toContain('<svg');
    expect(svg).toContain('<rect');
    expect(svg).toContain('<text');
    expect(svg).toContain('Hello &lt;board&gt;');
    expect(svg).toContain('<path');
    expect(svg).toContain('<polygon');
  });
});
