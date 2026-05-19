import { useEffect, useMemo } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { Loading } from './Loading';
import { LoginForm } from '../../components/auth/LoginForm';
import { useStores } from '../../store/useStore';
import { AuthViewModel } from '../../store/viewModels/authViewModel';

export const Auth = observer(() => {
  const navigate = useNavigate();
  const root = useStores();
  const viewModel = useMemo(() => new AuthViewModel(root), [root]);

  useEffect(() => {
    const init = async () => {
      await viewModel.initialize();

      if (viewModel.shouldShowApp) {
        viewModel.handleAuthRedirect(navigate);
      }
    };

    init();
  }, [navigate, viewModel]);

  if (viewModel.isLoading) {
    return <Loading/>;
  }

  if (viewModel.shouldShowAuth) {
    return <LoginForm />;
  }

  return null;
});
