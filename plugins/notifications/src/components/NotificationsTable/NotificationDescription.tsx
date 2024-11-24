/*
 * Copyright 2025 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { MarkdownContent } from '@backstage/core-components';
import Button from '@material-ui/core/Button';
import { useState } from 'react';

const MAX_LENGTH = 100;

const unescapeString = (str: string): string => {
  return str
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '	')
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\')
    .replace(/&#(\d+);/g, (_: string, dec: string) =>
      String.fromCharCode(parseInt(dec, 10)),
    )
    .replace(/&([^;]+);/g, (entity: string) => {
      const entities: Record<string, string> = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#39;': "'",
      };
      return entities[entity] || entity;
    });
};

export const NotificationDescription = (props: { description: string }) => {
  const description = unescapeString(props?.description) ?? '';
  const [shown, setShown] = useState(false);
  const isLong =
    description.length > MAX_LENGTH || description.indexOf('\n') > 0;

  if (!isLong) {
    return <MarkdownContent content={description} />;
  }

  if (shown) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
        }}
      >
        <MarkdownContent content={description} />
        <Button
          style={{ whiteSpace: 'nowrap' }}
          variant="text"
          size="small"
          onClick={() => {
            setShown(false);
          }}
        >
          Show less
        </Button>
      </div>
    );
  }
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
      }}
    >
      <MarkdownContent
        content={`${description.substring(
          0,
          description.indexOf('\n') > 0
            ? description.indexOf('\n')
            : MAX_LENGTH,
        )}...`}
      />
      <Button
        style={{ whiteSpace: 'nowrap' }}
        variant="text"
        size="small"
        onClick={() => {
          setShown(true);
        }}
      >
        Show more
      </Button>
    </div>
  );
};
