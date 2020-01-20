if [ "$IS_EMULATION_MODE" = "true" ]; then
  echo "Runing in emulation mode"
  cp services-mocks/* services/
else
  echo "Runing in real mode"
fi

mongroup -c config/mongroup.conf start
mongroup -c config/mongroup.conf logf
