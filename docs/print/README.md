# Porch papers: print pieces

Printed / emailed versions of the neighborhood papers. These live in `docs/`, so they are
kept in git but are NOT served on covenantbuilders.org.

| File | Paper | What it is |
|---|---|---|
| `PSL-Porch-Amendment-3-Snowbirds.pdf` | The PSL Porch | 8-page print of the Amendment 3 snowbird / second-home article (Oct 26, 2026) |
| `Orlando-Balcony-flyer.pdf` | The Orlando Balcony | 1-page intro flyer (Oct 26, 2026) |
| `The-Miami-Balcony-Issue-1.pdf` | The Miami Balcony | Vol. 1 No. 1 front page (Oct 2026) |

## How the article PDF was made
`scripts/porch-article-inline.py` downloads a live article page, strips scripts, and inlines its
CSS and images into one self-contained `article.html`, which is then printed to PDF in a
headless browser. Change the `U=` URL at the top to print a different article.

Outreach trackers and email lists are deliberately NOT in this repo: the repo is public and
those files hold people's names and emails.
