# Code Citations

## License: unknown
https://github.com/aJonghunPark/vite-react-ts-boilerplate/blob/c32f648abc232a22b0f6a9b71790ec9735c1263e/README.md

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "
```


## License: unknown
https://github.com/nocobase/nocobase/blob/f1f9f3ec288d104f7bc101a5505562a8037b2c44/packages/core/client/.dumi/theme/slots/PreviewerActions.tsx

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
```


## License: unknown
https://github.com/aJonghunPark/vite-react-ts-boilerplate/blob/c32f648abc232a22b0f6a9b71790ec9735c1263e/README.md

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "
```


## License: unknown
https://github.com/nocobase/nocobase/blob/f1f9f3ec288d104f7bc101a5505562a8037b2c44/packages/core/client/.dumi/theme/slots/PreviewerActions.tsx

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
```


## License: unknown
https://github.com/aJonghunPark/vite-react-ts-boilerplate/blob/c32f648abc232a22b0f6a9b71790ec9735c1263e/README.md

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "
```


## License: unknown
https://github.com/nocobase/nocobase/blob/f1f9f3ec288d104f7bc101a5505562a8037b2c44/packages/core/client/.dumi/theme/slots/PreviewerActions.tsx

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
```


## License: unknown
https://github.com/aJonghunPark/vite-react-ts-boilerplate/blob/c32f648abc232a22b0f6a9b71790ec9735c1263e/README.md

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "
```


## License: unknown
https://github.com/nocobase/nocobase/blob/f1f9f3ec288d104f7bc101a5505562a8037b2c44/packages/core/client/.dumi/theme/slots/PreviewerActions.tsx

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
```


## License: unknown
https://github.com/aJonghunPark/vite-react-ts-boilerplate/blob/c32f648abc232a22b0f6a9b71790ec9735c1263e/README.md

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "
```


## License: unknown
https://github.com/nocobase/nocobase/blob/f1f9f3ec288d104f7bc101a5505562a8037b2c44/packages/core/client/.dumi/theme/slots/PreviewerActions.tsx

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
```


## License: unknown
https://github.com/aJonghunPark/vite-react-ts-boilerplate/blob/c32f648abc232a22b0f6a9b71790ec9735c1263e/README.md

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "
```


## License: unknown
https://github.com/nocobase/nocobase/blob/f1f9f3ec288d104f7bc101a5505562a8037b2c44/packages/core/client/.dumi/theme/slots/PreviewerActions.tsx

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
```


## License: unknown
https://github.com/aJonghunPark/vite-react-ts-boilerplate/blob/c32f648abc232a22b0f6a9b71790ec9735c1263e/README.md

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "
```


## License: unknown
https://github.com/nocobase/nocobase/blob/f1f9f3ec288d104f7bc101a5505562a8037b2c44/packages/core/client/.dumi/theme/slots/PreviewerActions.tsx

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
```


## License: MIT
https://github.com/natewong1313/go-react-ssr/blob/960cd71be1380bf0428d790d111df29e5916e9d4/cli/cmd/create/const.go

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
```


## License: unknown
https://github.com/aJonghunPark/vite-react-ts-boilerplate/blob/c32f648abc232a22b0f6a9b71790ec9735c1263e/README.md

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "
```


## License: unknown
https://github.com/nocobase/nocobase/blob/f1f9f3ec288d104f7bc101a5505562a8037b2c44/packages/core/client/.dumi/theme/slots/PreviewerActions.tsx

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
```


## License: MIT
https://github.com/natewong1313/go-react-ssr/blob/960cd71be1380bf0428d790d111df29e5916e9d4/cli/cmd/create/const.go

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
```


## License: unknown
https://github.com/aJonghunPark/vite-react-ts-boilerplate/blob/c32f648abc232a22b0f6a9b71790ec9735c1263e/README.md

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "
```


## License: unknown
https://github.com/nocobase/nocobase/blob/f1f9f3ec288d104f7bc101a5505562a8037b2c44/packages/core/client/.dumi/theme/slots/PreviewerActions.tsx

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
```


## License: MIT
https://github.com/natewong1313/go-react-ssr/blob/960cd71be1380bf0428d790d111df29e5916e9d4/cli/cmd/create/const.go

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
```


## License: MIT
https://github.com/noahgsolomon/Codefoli/blob/2202ba68ac4b3294191eddc4fa550c541afeb7ba/lambda/codefolio-react-download.mjs

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noF
```


## License: unknown
https://github.com/nocobase/nocobase/blob/f1f9f3ec288d104f7bc101a5505562a8037b2c44/packages/core/client/.dumi/theme/slots/PreviewerActions.tsx

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
```


## License: unknown
https://github.com/aJonghunPark/vite-react-ts-boilerplate/blob/c32f648abc232a22b0f6a9b71790ec9735c1263e/README.md

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
```


## License: MIT
https://github.com/natewong1313/go-react-ssr/blob/960cd71be1380bf0428d790d111df29e5916e9d4/cli/cmd/create/const.go

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
```


## License: MIT
https://github.com/noahgsolomon/Codefoli/blob/2202ba68ac4b3294191eddc4fa550c541afeb7ba/lambda/codefolio-react-download.mjs

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noF
```


## License: unknown
https://github.com/sao-lang/laniakea-cli/blob/ba4c2b3f8e0b190df84b73b481bb8bedf5fa4521/packages/builder/src/ejs/spa/react/tsconfig.json.ejs

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths
```


## License: unknown
https://github.com/nocobase/nocobase/blob/f1f9f3ec288d104f7bc101a5505562a8037b2c44/packages/core/client/.dumi/theme/slots/PreviewerActions.tsx

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules
```


## License: unknown
https://github.com/aJonghunPark/vite-react-ts-boilerplate/blob/c32f648abc232a22b0f6a9b71790ec9735c1263e/README.md

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules
```


## License: MIT
https://github.com/natewong1313/go-react-ssr/blob/960cd71be1380bf0428d790d111df29e5916e9d4/cli/cmd/create/const.go

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
```


## License: MIT
https://github.com/noahgsolomon/Codefoli/blob/2202ba68ac4b3294191eddc4fa550c541afeb7ba/lambda/codefolio-react-download.mjs

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noF
```


## License: unknown
https://github.com/sao-lang/laniakea-cli/blob/ba4c2b3f8e0b190df84b73b481bb8bedf5fa4521/packages/builder/src/ejs/spa/react/tsconfig.json.ejs

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths
```


## License: unknown
https://github.com/nocobase/nocobase/blob/f1f9f3ec288d104f7bc101a5505562a8037b2c44/packages/core/client/.dumi/theme/slots/PreviewerActions.tsx

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "no
```


## License: unknown
https://github.com/aJonghunPark/vite-react-ts-boilerplate/blob/c32f648abc232a22b0f6a9b71790ec9735c1263e/README.md

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "no
```


## License: MIT
https://github.com/natewong1313/go-react-ssr/blob/960cd71be1380bf0428d790d111df29e5916e9d4/cli/cmd/create/const.go

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
```


## License: MIT
https://github.com/noahgsolomon/Codefoli/blob/2202ba68ac4b3294191eddc4fa550c541afeb7ba/lambda/codefolio-react-download.mjs

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noF
```


## License: unknown
https://github.com/sao-lang/laniakea-cli/blob/ba4c2b3f8e0b190df84b73b481bb8bedf5fa4521/packages/builder/src/ejs/spa/react/tsconfig.json.ejs

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths
```


## License: unknown
https://github.com/nocobase/nocobase/blob/f1f9f3ec288d104f7bc101a5505562a8037b2c44/packages/core/client/.dumi/theme/slots/PreviewerActions.tsx

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
```


## License: unknown
https://github.com/aJonghunPark/vite-react-ts-boilerplate/blob/c32f648abc232a22b0f6a9b71790ec9735c1263e/README.md

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
```


## License: MIT
https://github.com/natewong1313/go-react-ssr/blob/960cd71be1380bf0428d790d111df29e5916e9d4/cli/cmd/create/const.go

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
```


## License: MIT
https://github.com/noahgsolomon/Codefoli/blob/2202ba68ac4b3294191eddc4fa550c541afeb7ba/lambda/codefolio-react-download.mjs

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noF
```


## License: unknown
https://github.com/sao-lang/laniakea-cli/blob/ba4c2b3f8e0b190df84b73b481bb8bedf5fa4521/packages/builder/src/ejs/spa/react/tsconfig.json.ejs

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths
```


## License: unknown
https://github.com/nocobase/nocobase/blob/f1f9f3ec288d104f7bc101a5505562a8037b2c44/packages/core/client/.dumi/theme/slots/PreviewerActions.tsx

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
```


## License: unknown
https://github.com/aJonghunPark/vite-react-ts-boilerplate/blob/c32f648abc232a22b0f6a9b71790ec9735c1263e/README.md

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
```


## License: MIT
https://github.com/natewong1313/go-react-ssr/blob/960cd71be1380bf0428d790d111df29e5916e9d4/cli/cmd/create/const.go

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
```


## License: MIT
https://github.com/noahgsolomon/Codefoli/blob/2202ba68ac4b3294191eddc4fa550c541afeb7ba/lambda/codefolio-react-download.mjs

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noF
```


## License: unknown
https://github.com/sao-lang/laniakea-cli/blob/ba4c2b3f8e0b190df84b73b481bb8bedf5fa4521/packages/builder/src/ejs/spa/react/tsconfig.json.ejs

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths
```


## License: unknown
https://github.com/mrlectus/utilities/blob/4e6e54b6d0d6e4cf95c5e3bc93a94f5f657d0617/react-bun

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["
```


## License: unknown
https://github.com/nocobase/nocobase/blob/f1f9f3ec288d104f7bc101a5505562a8037b2c44/packages/core/client/.dumi/theme/slots/PreviewerActions.tsx

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
```


## License: unknown
https://github.com/aJonghunPark/vite-react-ts-boilerplate/blob/c32f648abc232a22b0f6a9b71790ec9735c1263e/README.md

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
```


## License: MIT
https://github.com/natewong1313/go-react-ssr/blob/960cd71be1380bf0428d790d111df29e5916e9d4/cli/cmd/create/const.go

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
```


## License: MIT
https://github.com/noahgsolomon/Codefoli/blob/2202ba68ac4b3294191eddc4fa550c541afeb7ba/lambda/codefolio-react-download.mjs

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noF
```


## License: unknown
https://github.com/sao-lang/laniakea-cli/blob/ba4c2b3f8e0b190df84b73b481bb8bedf5fa4521/packages/builder/src/ejs/spa/react/tsconfig.json.ejs

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths
```


## License: unknown
https://github.com/mrlectus/utilities/blob/4e6e54b6d0d6e4cf95c5e3bc93a94f5f657d0617/react-bun

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["
```


## License: unknown
https://github.com/nocobase/nocobase/blob/f1f9f3ec288d104f7bc101a5505562a8037b2c44/packages/core/client/.dumi/theme/slots/PreviewerActions.tsx

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
```


## License: unknown
https://github.com/aJonghunPark/vite-react-ts-boilerplate/blob/c32f648abc232a22b0f6a9b71790ec9735c1263e/README.md

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
```


## License: MIT
https://github.com/natewong1313/go-react-ssr/blob/960cd71be1380bf0428d790d111df29e5916e9d4/cli/cmd/create/const.go

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
```


## License: MIT
https://github.com/noahgsolomon/Codefoli/blob/2202ba68ac4b3294191eddc4fa550c541afeb7ba/lambda/codefolio-react-download.mjs

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noF
```


## License: unknown
https://github.com/sao-lang/laniakea-cli/blob/ba4c2b3f8e0b190df84b73b481bb8bedf5fa4521/packages/builder/src/ejs/spa/react/tsconfig.json.ejs

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths
```


## License: unknown
https://github.com/mrlectus/utilities/blob/4e6e54b6d0d6e4cf95c5e3bc93a94f5f657d0617/react-bun

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["
```


## License: unknown
https://github.com/nocobase/nocobase/blob/f1f9f3ec288d104f7bc101a5505562a8037b2c44/packages/core/client/.dumi/theme/slots/PreviewerActions.tsx

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
```


## License: unknown
https://github.com/aJonghunPark/vite-react-ts-boilerplate/blob/c32f648abc232a22b0f6a9b71790ec9735c1263e/README.md

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
```


## License: MIT
https://github.com/natewong1313/go-react-ssr/blob/960cd71be1380bf0428d790d111df29e5916e9d4/cli/cmd/create/const.go

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
```


## License: MIT
https://github.com/noahgsolomon/Codefoli/blob/2202ba68ac4b3294191eddc4fa550c541afeb7ba/lambda/codefolio-react-download.mjs

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noF
```


## License: unknown
https://github.com/sao-lang/laniakea-cli/blob/ba4c2b3f8e0b190df84b73b481bb8bedf5fa4521/packages/builder/src/ejs/spa/react/tsconfig.json.ejs

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths
```


## License: unknown
https://github.com/mrlectus/utilities/blob/4e6e54b6d0d6e4cf95c5e3bc93a94f5f657d0617/react-bun

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["
```


## License: unknown
https://github.com/nocobase/nocobase/blob/f1f9f3ec288d104f7bc101a5505562a8037b2c44/packages/core/client/.dumi/theme/slots/PreviewerActions.tsx

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noF
```


## License: MIT
https://github.com/noahgsolomon/Codefoli/blob/2202ba68ac4b3294191eddc4fa550c541afeb7ba/lambda/codefolio-react-download.mjs

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noF
```


## License: unknown
https://github.com/aJonghunPark/vite-react-ts-boilerplate/blob/c32f648abc232a22b0f6a9b71790ec9735c1263e/README.md

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noF
```


## License: MIT
https://github.com/natewong1313/go-react-ssr/blob/960cd71be1380bf0428d790d111df29e5916e9d4/cli/cmd/create/const.go

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noF
```


## License: unknown
https://github.com/sao-lang/laniakea-cli/blob/ba4c2b3f8e0b190df84b73b481bb8bedf5fa4521/packages/builder/src/ejs/spa/react/tsconfig.json.ejs

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths
```


## License: unknown
https://github.com/mrlectus/utilities/blob/4e6e54b6d0d6e4cf95c5e3bc93a94f5f657d0617/react-bun

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["
```


## License: unknown
https://github.com/sjyoung428/react-canvas/blob/7bce966b7de872bde294d0a0fdef2b5d20d076d1/README.md

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
````

The
```


## License: unknown
https://github.com/nocobase/nocobase/blob/f1f9f3ec288d104f7bc101a5505562a8037b2c44/packages/core/client/.dumi/theme/slots/PreviewerActions.tsx

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths
```


## License: MIT
https://github.com/noahgsolomon/Codefoli/blob/2202ba68ac4b3294191eddc4fa550c541afeb7ba/lambda/codefolio-react-download.mjs

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths
```


## License: unknown
https://github.com/aJonghunPark/vite-react-ts-boilerplate/blob/c32f648abc232a22b0f6a9b71790ec9735c1263e/README.md

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths
```


## License: MIT
https://github.com/natewong1313/go-react-ssr/blob/960cd71be1380bf0428d790d111df29e5916e9d4/cli/cmd/create/const.go

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths
```


## License: unknown
https://github.com/sao-lang/laniakea-cli/blob/ba4c2b3f8e0b190df84b73b481bb8bedf5fa4521/packages/builder/src/ejs/spa/react/tsconfig.json.ejs

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths
```


## License: unknown
https://github.com/mrlectus/utilities/blob/4e6e54b6d0d6e4cf95c5e3bc93a94f5f657d0617/react-bun

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["
```


## License: unknown
https://github.com/sjyoung428/react-canvas/blob/7bce966b7de872bde294d0a0fdef2b5d20d076d1/README.md

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
````

The
```


## License: unknown
https://github.com/nocobase/nocobase/blob/f1f9f3ec288d104f7bc101a5505562a8037b2c44/packages/core/client/.dumi/theme/slots/PreviewerActions.tsx

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["
```


## License: unknown
https://github.com/mrlectus/utilities/blob/4e6e54b6d0d6e4cf95c5e3bc93a94f5f657d0617/react-bun

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["
```


## License: MIT
https://github.com/noahgsolomon/Codefoli/blob/2202ba68ac4b3294191eddc4fa550c541afeb7ba/lambda/codefolio-react-download.mjs

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["
```


## License: unknown
https://github.com/aJonghunPark/vite-react-ts-boilerplate/blob/c32f648abc232a22b0f6a9b71790ec9735c1263e/README.md

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["
```


## License: MIT
https://github.com/natewong1313/go-react-ssr/blob/960cd71be1380bf0428d790d111df29e5916e9d4/cli/cmd/create/const.go

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["
```


## License: unknown
https://github.com/sao-lang/laniakea-cli/blob/ba4c2b3f8e0b190df84b73b481bb8bedf5fa4521/packages/builder/src/ejs/spa/react/tsconfig.json.ejs

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["
```


## License: unknown
https://github.com/sjyoung428/react-canvas/blob/7bce966b7de872bde294d0a0fdef2b5d20d076d1/README.md

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
````

The
```


## License: unknown
https://github.com/nocobase/nocobase/blob/f1f9f3ec288d104f7bc101a5505562a8037b2c44/packages/core/client/.dumi/theme/slots/PreviewerActions.tsx

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["
```


## License: unknown
https://github.com/mrlectus/utilities/blob/4e6e54b6d0d6e4cf95c5e3bc93a94f5f657d0617/react-bun

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["
```


## License: MIT
https://github.com/noahgsolomon/Codefoli/blob/2202ba68ac4b3294191eddc4fa550c541afeb7ba/lambda/codefolio-react-download.mjs

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["
```


## License: unknown
https://github.com/aJonghunPark/vite-react-ts-boilerplate/blob/c32f648abc232a22b0f6a9b71790ec9735c1263e/README.md

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["
```


## License: MIT
https://github.com/natewong1313/go-react-ssr/blob/960cd71be1380bf0428d790d111df29e5916e9d4/cli/cmd/create/const.go

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["
```


## License: unknown
https://github.com/sao-lang/laniakea-cli/blob/ba4c2b3f8e0b190df84b73b481bb8bedf5fa4521/packages/builder/src/ejs/spa/react/tsconfig.json.ejs

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["
```


## License: unknown
https://github.com/sjyoung428/react-canvas/blob/7bce966b7de872bde294d0a0fdef2b5d20d076d1/README.md

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
````

The
```


## License: unknown
https://github.com/nocobase/nocobase/blob/f1f9f3ec288d104f7bc101a5505562a8037b2c44/packages/core/client/.dumi/theme/slots/PreviewerActions.tsx

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["
```


## License: unknown
https://github.com/mrlectus/utilities/blob/4e6e54b6d0d6e4cf95c5e3bc93a94f5f657d0617/react-bun

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["
```


## License: MIT
https://github.com/noahgsolomon/Codefoli/blob/2202ba68ac4b3294191eddc4fa550c541afeb7ba/lambda/codefolio-react-download.mjs

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["
```


## License: unknown
https://github.com/aJonghunPark/vite-react-ts-boilerplate/blob/c32f648abc232a22b0f6a9b71790ec9735c1263e/README.md

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["
```


## License: MIT
https://github.com/natewong1313/go-react-ssr/blob/960cd71be1380bf0428d790d111df29e5916e9d4/cli/cmd/create/const.go

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["
```


## License: unknown
https://github.com/sao-lang/laniakea-cli/blob/ba4c2b3f8e0b190df84b73b481bb8bedf5fa4521/packages/builder/src/ejs/spa/react/tsconfig.json.ejs

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["
```


## License: unknown
https://github.com/sjyoung428/react-canvas/blob/7bce966b7de872bde294d0a0fdef2b5d20d076d1/README.md

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
````

The
```


## License: unknown
https://github.com/nocobase/nocobase/blob/f1f9f3ec288d104f7bc101a5505562a8037b2c44/packages/core/client/.dumi/theme/slots/PreviewerActions.tsx

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node
```


## License: unknown
https://github.com/mrlectus/utilities/blob/4e6e54b6d0d6e4cf95c5e3bc93a94f5f657d0617/react-bun

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node
```


## License: MIT
https://github.com/noahgsolomon/Codefoli/blob/2202ba68ac4b3294191eddc4fa550c541afeb7ba/lambda/codefolio-react-download.mjs

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node
```


## License: unknown
https://github.com/aJonghunPark/vite-react-ts-boilerplate/blob/c32f648abc232a22b0f6a9b71790ec9735c1263e/README.md

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node
```


## License: MIT
https://github.com/natewong1313/go-react-ssr/blob/960cd71be1380bf0428d790d111df29e5916e9d4/cli/cmd/create/const.go

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node
```


## License: unknown
https://github.com/sao-lang/laniakea-cli/blob/ba4c2b3f8e0b190df84b73b481bb8bedf5fa4521/packages/builder/src/ejs/spa/react/tsconfig.json.ejs

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node
```


## License: unknown
https://github.com/sjyoung428/react-canvas/blob/7bce966b7de872bde294d0a0fdef2b5d20d076d1/README.md

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
````

The
```


## License: unknown
https://github.com/nocobase/nocobase/blob/f1f9f3ec288d104f7bc101a5505562a8037b2c44/packages/core/client/.dumi/theme/slots/PreviewerActions.tsx

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node
```


## License: unknown
https://github.com/mrlectus/utilities/blob/4e6e54b6d0d6e4cf95c5e3bc93a94f5f657d0617/react-bun

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node
```


## License: MIT
https://github.com/noahgsolomon/Codefoli/blob/2202ba68ac4b3294191eddc4fa550c541afeb7ba/lambda/codefolio-react-download.mjs

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node
```


## License: unknown
https://github.com/aJonghunPark/vite-react-ts-boilerplate/blob/c32f648abc232a22b0f6a9b71790ec9735c1263e/README.md

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node
```


## License: MIT
https://github.com/natewong1313/go-react-ssr/blob/960cd71be1380bf0428d790d111df29e5916e9d4/cli/cmd/create/const.go

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node
```


## License: unknown
https://github.com/sao-lang/laniakea-cli/blob/ba4c2b3f8e0b190df84b73b481bb8bedf5fa4521/packages/builder/src/ejs/spa/react/tsconfig.json.ejs

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node
```


## License: unknown
https://github.com/sjyoung428/react-canvas/blob/7bce966b7de872bde294d0a0fdef2b5d20d076d1/README.md

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
````

The
```


## License: unknown
https://github.com/nocobase/nocobase/blob/f1f9f3ec288d104f7bc101a5505562a8037b2c44/packages/core/client/.dumi/theme/slots/PreviewerActions.tsx

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
````

The
```


## License: unknown
https://github.com/mrlectus/utilities/blob/4e6e54b6d0d6e4cf95c5e3bc93a94f5f657d0617/react-bun

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
````

The
```


## License: unknown
https://github.com/sjyoung428/react-canvas/blob/7bce966b7de872bde294d0a0fdef2b5d20d076d1/README.md

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
````

The
```


## License: MIT
https://github.com/noahgsolomon/Codefoli/blob/2202ba68ac4b3294191eddc4fa550c541afeb7ba/lambda/codefolio-react-download.mjs

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
````

The
```


## License: unknown
https://github.com/aJonghunPark/vite-react-ts-boilerplate/blob/c32f648abc232a22b0f6a9b71790ec9735c1263e/README.md

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
````

The
```


## License: MIT
https://github.com/natewong1313/go-react-ssr/blob/960cd71be1380bf0428d790d111df29e5916e9d4/cli/cmd/create/const.go

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
````

The
```


## License: unknown
https://github.com/sao-lang/laniakea-cli/blob/ba4c2b3f8e0b190df84b73b481bb8bedf5fa4521/packages/builder/src/ejs/spa/react/tsconfig.json.ejs

```
The error occurs because the import path uses the `@` alias, but TypeScript can't resolve it. Looking at your [vite.config.ts](vite.config.ts), the `@` alias is configured to point to `./src`, so the import should work. However, you need to also configure TypeScript to recognize this alias.

Here's the fix:

````typescript
// filepath: /home/andrew/HireSense/FrontEnd/src/app/pages/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../lib/auth-context';
import { apiRequest } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
// ...existing code...
````

The issue is that you're using `@/lib/auth-context` and `@/lib/api`, but these should use relative paths like the rest of your codebase. Change:

- `@/lib/auth-context` → `../../lib/auth-context`
- `@/lib/api` → `../../lib/api`

Alternatively, if you want to keep using the `@` alias, you need to add a `tsconfig.json` file (or update it) with the paths mapping:

````json
// filepath: /home/andrew/HireSense/FrontEnd/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
````

The
```

